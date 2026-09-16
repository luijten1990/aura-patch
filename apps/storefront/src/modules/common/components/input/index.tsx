import { Label, clx } from "@modules/common/components/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  variant?: "default" | "aura"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      touched: _touched,
      required,
      topLabel,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className={clx(
              "mt-0 block h-11 w-full appearance-none px-4 pb-1 pt-4 focus:outline-none focus:ring-0",
              variant === "aura"
                ? "h-12 rounded-full border border-aura-forest/20 bg-[#f7f4ed] text-aura-forest hover:border-aura-forest/40 focus:border-aura-forest"
                : "rounded-md border border-ui-border-base bg-ui-bg-field hover:bg-ui-bg-field-hover focus:shadow-borders-interactive-with-active"
            )}
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className={clx(
              "absolute top-3 -z-1 mx-3 flex origin-0 items-center justify-center px-1 transition-all duration-300",
              variant === "aura" ? "text-aura-forest/45" : "text-ui-fg-subtle"
            )}
          >
            {label}
            {required && (
              <span
                className={
                  variant === "aura" ? "text-aura-gold" : "text-rose-500"
                }
              >
                *
              </span>
            )}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={clx(
                "absolute right-0 top-3 px-4 outline-none transition-all duration-150 focus:outline-none",
                variant === "aura"
                  ? "text-aura-forest/45 focus:text-aura-forest"
                  : "text-ui-fg-subtle focus:text-ui-fg-base"
              )}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
