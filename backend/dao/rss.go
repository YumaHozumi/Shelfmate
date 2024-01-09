package dao

import (
	"bookshelf/domain/object"
	"bookshelf/domain/repository"
	"context"
	"encoding/xml"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
)

type rss struct{}

func NewRSS() repository.RSS {
	return &rss{}
}

func (r *rss) SearchBooks(ctx context.Context, isbn string) (*object.RSS, error) {
	baseURL, err := url.Parse("https://iss.ndl.go.jp/api/opensearch")
	if err != nil {
		return nil, err
	}
	params := url.Values{}
	params.Add("cnt", "1")
	params.Add("isbn", isbn)
	params.Add("dpid", "iss-ndl-opac")
	baseURL.RawQuery = params.Encode()

	res, err := http.Get(baseURL.String())
	if err != nil {
		fmt.Println(1)
		return nil, err
	}

	var rss *object.RSS
	if err := xml.NewDecoder(res.Body).Decode(&rss); err != nil {
		fmt.Println(2)
		return nil, err
	}

	if rss == nil || len(rss.Channel.Items) == 0 {
		fmt.Println(3)
		return nil, object.ErrBookNotFound
	}

	item := rss.Channel.Items[0]
	rss.Channel.Items[0].Title = item.Title + " " + strconv.Itoa(item.OrderNumber)

	return rss, nil
}
