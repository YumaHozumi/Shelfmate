package books

import (
	"bookshelf/domain/object"
	"encoding/json"
	"errors"
	"fmt"
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
	fmt.Println("1")
	if err := validateISBN(isbn); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	fmt.Println("2")
	rss, err := h.rr.SearchBooks(ctx, isbn)
	if err != nil {
		fmt.Println("3")
		fmt.Println(err)
		if errors.Is(err, object.ErrBookNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	fmt.Println("4")
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
				return errors.New("ISBNは数字のみ含める必要があります")
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
			return errors.New("ISBNは数字のみ含める必要があります")
		}
		if checkDigit != lastDigit {
			return errors.New("無効なISBN-13チェックデジット")
		}
		return nil
	}

	// Validate ISBN-10
	if length == 10 {
		var sum int
		for i := 0; i < 9; i++ {
			digit, err := strconv.Atoi(string(isbn[i]))
			if err != nil {
				return errors.New("ISBNは数字のみ含める必要があります")
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
				return errors.New("ISBN-10のチェックデジットは数字または'X'である必要があります")
			}
		}
		if checkDigit != lastDigit {
			return errors.New("無効なISBN-10チェックデジット")
		}
		return nil
	}

	return errors.New("ISBNは10文字または13文字である必要があります")
}
