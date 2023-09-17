package books

import (
	"bookshelf/domain/repository"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type handler struct {
	rr repository.RSS
}

func NewRouter(rr repository.RSS) http.Handler {
	r := chi.NewRouter()

	h := &handler{rr}
	r.Get("/search", h.Search)

	return r
}
