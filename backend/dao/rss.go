package dao

import (
	"bookshelf/domain/object"
	"bookshelf/domain/repository"
	"context"
	"encoding/xml"
	"fmt"
	"net/http"
	"net/url"
)

type rss struct{}

func NewRSS() repository.RSS {
	return &rss{}
}

func (r *rss) SearchBooks(ctx context.Context, word string) (*object.RSS, error) {
	baseURL, err := url.Parse("https://iss.ndl.go.jp/api/opensearch")
	if err != nil {
		return nil, err
	}
	//クエリパラメータを作成
	params := url.Values{}
	params.Add("cnt", "2")
	params.Add("title", word)

	//クエリパラメータをURLに追加
	baseURL.RawQuery = params.Encode()

	fmt.Println(baseURL.String())

	res, err := http.Get(baseURL.String())
	if err != nil {
		return nil, err
	}

	var rss *object.RSS

	if err := xml.NewDecoder(res.Body).Decode(&rss); err != nil {
		return nil, err
	}

	return rss, nil
}
