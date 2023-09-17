import * as yup from 'yup'

const validateWithYup = (schema: yup.StringSchema, value: string) => {
  try {
    schema.validateSync(value)
    return true
  } catch (err) {
    if (err instanceof Error) {
      return err.message
    }
    return 'An unknown error occurred'
  }
}

const rules = {
  hyphen: (value: string) =>
    validateWithYup(
      yup.string().test('hyphen', 'ハイフンなしで入力してください', (val) => !val?.includes('-')),
      value
    ),
  zenkaku: (value: string) =>
    validateWithYup(
      yup
        .string()
        .test('zenkaku', '半角数字で入力してください', (val) => !/[０-９]/.test(val || '')),
      value
    ),
  isbn: (value: string) =>
    validateWithYup(
      yup.string().test('isbn', '無効なISBNです', (val) => validateISBN(val || '')),
      value
    ),
  email: (value: string) =>
    validateWithYup(
      yup
        .string()
        .email('有効なメールアドレスを入力してください')
        .required('メールアドレスは必須です'),
      value
    ),
  required: (value: string) => validateWithYup(yup.string().required('入力は必須です'), value),
  password: (value: string) =>
    validateWithYup(
      yup
        .string()
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/,
          'パスワードは6文字以上であり、少なくとも1つの大文字、1つの小文字、1つの数字を含む必要があります'
        ),
      value
    )
}

const validateISBN = (isbn: string): boolean => {
  const length = isbn.length

  // Validate ISBN-13
  if (length === 13) {
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) {
        return false
      }
      if (i % 2 === 0) {
        sum += digit
      } else {
        sum += 3 * digit
      }
    }
    let checkDigit = 10 - (sum % 10)
    if (checkDigit === 10) {
      checkDigit = 0
    }
    const lastDigit = parseInt(isbn[12], 10)
    if (isNaN(lastDigit)) {
      return false
    }
    return checkDigit === lastDigit
  }

  // Validate ISBN-10
  if (length === 10) {
    let sum = 0
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(isbn[i], 10)
      if (isNaN(digit)) {
        return false
      }
      sum += digit * (10 - i)
    }
    const checkDigit = 11 - (sum % 11)
    let lastDigit: number
    if (isbn[9] === 'X') {
      lastDigit = 10
    } else {
      lastDigit = parseInt(isbn[9], 10)
      if (isNaN(lastDigit)) {
        return false
      }
    }
    return checkDigit === lastDigit
  }

  return false
}

export { rules }
