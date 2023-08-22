package repository

import (
	"bookshelf/domain/object"
	"context"
)

type RSS interface {
	SearchBooks(ctx context.Context, word string) (*object.RSS, error)
}
