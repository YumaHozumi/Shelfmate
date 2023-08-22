package main

import (
	"bookshelf/dao"
	"bookshelf/handler"
	"context"
	"log"
	"net/http"
)

func main() {
	log.Fatalf("%+v", serve(context.Background()))
}

func serve(ctx context.Context) error {
	log.Printf("start server")

	return http.ListenAndServe(":8080", handler.NewRouter(dao.NewRSS()))
}
