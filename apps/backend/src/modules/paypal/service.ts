import {
  AbstractPaymentProvider,
  BigNumber,
  MedusaError,
  PaymentActions,
} from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrderApplicationContextLandingPage,
  OrderApplicationContextUserAction,
  OrdersController,
  OrderStatus,
  PatchOp,
  PaymentsController,
} from "@paypal/paypal-server-sdk"
import type { OrderRequest } from "@paypal/paypal-server-sdk"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

type Options = {
  client_id: string
  client_secret: string
  environment?: "sandbox" | "production"
  autoCapture?: boolean
  webhook_id?: string
}

type InjectedDependencies = {
  logger: Logger
}

const formatAmount = (amount: unknown) =>
  Number(new BigNumber(amount as number).numeric).toFixed(2)

class PayPalPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "paypal"

  protected logger_: Logger
  protected options_: Options
  protected client_: Client
  protected ordersController_: OrdersController
  protected paymentsController_: PaymentsController

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options)

    this.logger_ = container.logger
    this.options_ = {
      environment: "sandbox",
      autoCapture: true,
      ...options,
    }

    this.client_ = new Client({
      environment:
        this.options_.environment === "production"
          ? Environment.Production
          : Environment.Sandbox,
      clientCredentialsAuthCredentials: {
        oAuthClientId: this.options_.client_id,
        oAuthClientSecret: this.options_.client_secret,
      },
    })

    this.ordersController_ = new OrdersController(this.client_)
    this.paymentsController_ = new PaymentsController(this.client_)
  }

  static validateOptions(options: Record<string, unknown>): void | never {
    if (!options.client_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal client ID is required"
      )
    }
    if (!options.client_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal client secret is required"
      )
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    try {
      const { amount, currency_code } = input
      const intent = this.options_.autoCapture
        ? CheckoutPaymentIntent.Capture
        : CheckoutPaymentIntent.Authorize

      const orderRequest: OrderRequest = {
        intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency_code.toUpperCase(),
              value: formatAmount(amount),
            },
            description: "Aura Patch",
            customId: input.data?.session_id as string | undefined,
          },
        ],
        applicationContext: {
          brandName: "Aura Patch",
          landingPage: OrderApplicationContextLandingPage.NoPreference,
          userAction: OrderApplicationContextUserAction.PayNow,
        },
      }

      const response = await this.ordersController_.createOrder({
        body: orderRequest,
        prefer: "return=representation",
      })

      const order = response.result

      if (!order?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to create PayPal order"
        )
      }

      const approvalUrl = order.links?.find((link) => link.rel === "approve")
        ?.href

      return {
        id: order.id,
        data: {
          order_id: order.id,
          intent,
          status: order.status,
          approval_url: approvalUrl,
          session_id: input.data?.session_id,
          currency_code,
        },
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown PayPal error"
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to initiate PayPal payment: ${message}`
      )
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const orderId = input.data?.order_id as string | undefined

    if (!orderId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal order ID is required"
      )
    }

    if (this.options_.autoCapture) {
      const response = await this.ordersController_.captureOrder({
        id: orderId,
        prefer: "return=representation",
      })
      const capture = response.result
      const captureId =
        capture?.purchaseUnits?.[0]?.payments?.captures?.[0]?.id

      return {
        data: {
          ...input.data,
          capture_id: captureId,
          intent: "CAPTURE",
        },
        status: "captured" as PaymentSessionStatus,
      }
    }

    const response = await this.ordersController_.authorizeOrder({
      id: orderId,
      prefer: "return=representation",
    })
    const authorization = response.result
    const authId =
      authorization?.purchaseUnits?.[0]?.payments?.authorizations?.[0]?.id

    return {
      data: {
        order_id: orderId,
        authorization_id: authId,
        intent: "AUTHORIZE",
        currency_code: input.data?.currency_code,
      },
      status: "authorized" as PaymentSessionStatus,
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    const authorizationId = input.data?.authorization_id as string | undefined

    if (!authorizationId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal authorization ID is required for capture"
      )
    }

    const response = await this.paymentsController_.captureAuthorizedPayment({
      authorizationId,
      prefer: "return=representation",
    })
    const capture = response.result

    if (!capture?.id) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to capture PayPal payment"
      )
    }

    return {
      data: {
        ...input.data,
        capture_id: capture.id,
      },
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const captureId = input.data?.capture_id as string | undefined

    if (!captureId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal capture ID is required for refund"
      )
    }

    const response = await this.paymentsController_.refundCapturedPayment({
      captureId,
      body: {
        amount: {
          currencyCode:
            (input.data?.currency_code as string | undefined)?.toUpperCase() ||
            "",
          value: formatAmount(input.amount),
        },
      },
      prefer: "return=representation",
    })
    const refund = response.result

    if (!refund?.id) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to refund PayPal payment"
      )
    }

    return {
      data: {
        ...input.data,
        refund_id: refund.id,
      },
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const orderId = input.data?.order_id as string | undefined

    if (!orderId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal order ID is required"
      )
    }

    await this.ordersController_.patchOrder({
      id: orderId,
      body: [
        {
          op: PatchOp.Replace,
          path: "/purchase_units/@reference_id=='default'/amount/value",
          value: formatAmount(input.amount),
        },
      ],
    })

    return {
      data: {
        ...input.data,
        currency_code: input.currency_code,
      },
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const orderId = input.data?.order_id as string | undefined

    if (!orderId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal order ID is required"
      )
    }

    const response = await this.ordersController_.getOrder({ id: orderId })
    const order = response.result

    if (!order?.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "PayPal order not found"
      )
    }

    return {
      data: {
        order_id: order.id,
        status: order.status,
        intent: order.intent,
      },
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const authorizationId = input.data?.authorization_id as string | undefined

    if (!authorizationId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal authorization ID is required for cancellation"
      )
    }

    await this.paymentsController_.voidPayment({ authorizationId })
    return { data: input.data }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const orderId = input.data?.order_id as string | undefined

    if (!orderId) {
      return { status: "pending" as PaymentSessionStatus }
    }

    try {
      const response = await this.ordersController_.getOrder({ id: orderId })
      const status = response.result?.status

      switch (status) {
        case OrderStatus.Approved:
        case OrderStatus.Completed:
          return { status: "authorized" as PaymentSessionStatus }
        case OrderStatus.Voided:
          return { status: "canceled" as PaymentSessionStatus }
        default:
          return { status: "pending" as PaymentSessionStatus }
      }
    } catch {
      return { status: "pending" as PaymentSessionStatus }
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const eventType = (payload.data as { event_type?: string })?.event_type
    const resource = (payload.data as { resource?: Record<string, unknown> })
      ?.resource
    const sessionId = resource?.custom_id as string | undefined

    if (!eventType || !sessionId) {
      return {
        action: PaymentActions.NOT_SUPPORTED,
        data: { session_id: "", amount: new BigNumber(0) },
      }
    }

    const amountValue =
      (resource?.amount as { value?: string } | undefined)?.value || 0
    const payloadData = {
      session_id: sessionId,
      amount: new BigNumber(amountValue),
    }

    switch (eventType) {
      case "PAYMENT.AUTHORIZATION.CREATED":
        return { action: PaymentActions.AUTHORIZED, data: payloadData }
      case "PAYMENT.CAPTURE.COMPLETED":
        return { action: PaymentActions.SUCCESSFUL, data: payloadData }
      case "PAYMENT.CAPTURE.DENIED":
        return { action: PaymentActions.FAILED, data: payloadData }
      case "PAYMENT.AUTHORIZATION.VOIDED":
        return { action: PaymentActions.CANCELED, data: payloadData }
      default:
        return { action: PaymentActions.NOT_SUPPORTED, data: payloadData }
    }
  }
}

export default PayPalPaymentProviderService
