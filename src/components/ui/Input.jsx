'use client'

import { forwardRef, useId, useState } from 'react'

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    error,
    hint,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const id = useId()
  const [hasValue, setHasValue] = useState(Boolean(props.defaultValue || props.value))

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <div
        className="input-float-group"
        data-error={Boolean(error)}
        data-has-value={hasValue}
      >
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder=" "
          className={className}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
          }
          {...props}
          onChange={handleChange}
        />
        {label && <label htmlFor={id}>{label}</label>}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-[0.6875rem] font-sans font-medium text-[var(--color-error)] tracking-wide"
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p
          id={`${id}-hint`}
          className="text-[0.6875rem] font-sans font-light text-[var(--color-warm-gray)] tracking-wide"
        >
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
