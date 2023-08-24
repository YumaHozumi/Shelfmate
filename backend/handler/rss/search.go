package books

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
)

// @Summary Search books
// @Description Search books by keyword
// @ID search-books
// @Accept  json
// @Produce  json
// @Param   isbn     query    string     true        "Search keyword"
// @Success 200 {array} object.RSS
// @Router /api/books/search [get]
func (h *handler) Search(w http.ResponseWriter, r *http.Request) {
	isbn := r.URL.Query().Get("isbn")

	if err := validateISBN(isbn); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ctx := r.Context()

	rss, err := h.rr.SearchBooks(ctx, isbn)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(rss); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// validateISBN validates if the given string is a valid ISBN-10 or ISBN-13, and returns an error if not.
func validateISBN(isbn string) error {
	length := len(isbn)

	// Validate ISBN-13
	if length == 13 {
		var sum int
		for i := 0; i < 12; i++ {
			digit, err := strconv.Atoi(string(isbn[i]))
			if err != nil {
				return errors.New("ISBN must contain only digits")
			}
			if i%2 == 0 {
				sum += digit
			} else {
				sum += 3 * digit
			}
		}
		checkDigit := 10 - sum%10
		if checkDigit == 10 {
			checkDigit = 0
		}
		lastDigit, err := strconv.Atoi(string(isbn[12]))
		if err != nil {
			return errors.New("ISBN must contain only digits")
		}
		if checkDigit != lastDigit {
			return errors.New("invalid ISBN-13 check digit")
		}
		return nil
	}

	// Validate ISBN-10
	if length == 10 {
		var sum int
		for i := 0; i < 9; i++ {
			digit, err := strconv.Atoi(string(isbn[i]))
			if err != nil {
				return errors.New("ISBN must contain only digits")
			}
			sum += digit * (10 - i)
		}
		checkDigit := 11 - sum%11
		var lastDigit int
		if isbn[9] == 'X' {
			lastDigit = 10
		} else {
			var err error
			lastDigit, err = strconv.Atoi(string(isbn[9]))
			if err != nil {
				return errors.New("ISBN-10 check digit must be a digit or 'X'")
			}
		}
		if checkDigit != lastDigit {
			return errors.New("invalid ISBN-10 check digit")
		}
		return nil
	}

	return errors.New("ISBN must be 10 or 13 characters long")
}
