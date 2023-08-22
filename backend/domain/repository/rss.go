package repository

import (
	"bookshelf/domain/object"
	"context"
)

type RSS interface {
	SearchBooks(ctx context.Context, isbn string) (*object.RSS, error)
}
