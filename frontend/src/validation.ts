const rules = {
    hyphen: (value: string) => !value.includes('-') || "ハイフンなしで入力してください",
    zenkaku: (value: string) => !/[０-９]/.test(value) || "半角数字で入力してください",
    isbn: (value: string) => validateISBN(value) || "無効なISBNです",
}

const validateISBN = (isbn: string): boolean => {
    const length = isbn.length;

    // Validate ISBN-13
    if (length === 13) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
        const digit = parseInt(isbn[i], 10);
        if (isNaN(digit)) {
            return false;
        }
        if (i % 2 === 0) {
            sum += digit;
        } else {
            sum += 3 * digit;
        }
        }
        let checkDigit = 10 - sum % 10;
        if (checkDigit === 10) {
        checkDigit = 0;
        }
        const lastDigit = parseInt(isbn[12], 10);
        if (isNaN(lastDigit)) {
        return false;
        }
        return checkDigit === lastDigit;
    }

    // Validate ISBN-10
    if (length === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
        const digit = parseInt(isbn[i], 10);
        if (isNaN(digit)) {
            return false;
        }
        sum += digit * (10 - i);
        }
        const checkDigit = 11 - sum % 11;
        let lastDigit: number;
        if (isbn[9] === 'X') {
        lastDigit = 10;
        } else {
        lastDigit = parseInt(isbn[9], 10);
        if (isNaN(lastDigit)) {
            return false;
        }
        }
        return checkDigit === lastDigit;
    }

    return false;
}

export {rules }