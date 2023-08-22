package books

import (
	"encoding/json"
	"fmt"
	"net/http"
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

	fmt.Println(isbn)
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
