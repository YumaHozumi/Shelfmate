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
// @Param   key     query    string     true        "Search keyword"
// @Success 200 {array} object.RSS
// @Router /search [get]
func (h *handler) Search(w http.ResponseWriter, r *http.Request) {
	word := r.URL.Query().Get("key")

	fmt.Println(word)
	ctx := r.Context()

	rss, err := h.rr.SearchBooks(ctx, word)
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
