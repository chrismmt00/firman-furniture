'use client'

import { forwardRef, useId, useState } from 'react'

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className="shrink-0 pointer-events-none"
  >
    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Select = forwardRef(function Select(
  {
    label,
    options = [],
    placeholder,
    error,
    hint,
    className = '',
    containerClassName = '',
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref
) {
  const id = useId()
  const [selected, setSelected] = useState(value ?? defaultValue ?? '')

  const isEmpty = !selected || selected === ''

  const handleChange = (e) => {
    setSelected(e.target.value)
    onChange?.(e)
  }

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <div
        className="input-float-group relative"
        data-error={Boolean(error)}
        data-has-value={!isEmpty}
      >
        <select
          ref={ref}
          id={id}
          value={value ?? selected}
          data-empty={isEmpty}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
          }
          className={`pr-8 ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            )
          )}
        </select>

        {label && <label htmlFor={id}>{label}</label>}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-warm-gray)]">
          <ChevronDown />
        </div>
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

export default Select
