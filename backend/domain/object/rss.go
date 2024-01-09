package object

import (
	"encoding/base64"
	"encoding/xml"
	"math/big"
	"net/http"
	"strconv"
	"strings"
)

type RSS struct {
	Channel Channel `xml:"channel" json:"result"`
}

type Channel struct {
	Items []Item `xml:"item" json:"items"`
}

type Item struct {
	BookId         string `json:"bookId"`
	Title          string `xml:"title" json:"title"`
	Detail         string `json:"detail"` // 読み込むのはカスタム関数で
	Author         string `xml:"author" json:"author"`
	PublicDate     string `xml:"pubDate" json:"public_date"`
	ISBNIdentifier int64  `json:"isbn"`
	OrderNumber    int    `xml:"volume" json:"orderNumber"`
	ImageURL       string `json:"image_url"`
}

func (item *Item) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
	for {
		token, err := d.Token()
		if err != nil {
			return err
		}
		switch t := token.(type) {
		case xml.StartElement:
			switch t.Name.Local {
			case "title":
				if err := d.DecodeElement(&item.Title, &t); err != nil {
					return err
				}
			case "volume":
				if err := d.DecodeElement(&item.OrderNumber, &t); err != nil {
					return err
				}
			case "author":
				if err := d.DecodeElement(&item.Author, &t); err != nil {
					return err
				}
			case "pubDate":
				if err := d.DecodeElement(&item.PublicDate, &t); err != nil {
					return err
				}
			case "identifier":
				for _, attr := range t.Attr {
					if attr.Name.Local == "type" && attr.Value == "dcndl:ISBN" {
						var isbn_s string
						if err := d.DecodeElement(&isbn_s, &t); err != nil {
							return err
						}
						isbn_s = strings.ReplaceAll(isbn_s, "-", "")

						//ISBNを数値に変換
						isbn, err := strconv.ParseInt(isbn_s, 10, 64)
						if err != nil {
							return err
						}

						item.ISBNIdentifier = isbn

						num := big.NewInt(isbn)
						bytes := num.Bytes()
						// Base64エンコーディングを使用してbytesを文字列に変換
						bookId := base64.URLEncoding.EncodeToString(bytes)
						item.BookId = bookId

						if strISBN := strconv.FormatInt(isbn, 10); strISBN != "" {
							picImage := "https://iss.ndl.go.jp/thumbnail/" + strISBN

							resp, err := http.Head(picImage)
							if err != nil {
								return err
							}
							defer resp.Body.Close()

							if resp.StatusCode == http.StatusNotFound {
								item.ImageURL = ""
							} else {
								item.ImageURL = picImage
							}
						}
					}
				}
			case "description":
				if t.Name.Space == "" {
					if err := d.DecodeElement(&item.Detail, &t); err != nil {
						return err
					}
				}
			}
		case xml.EndElement:
			if t.Name == start.Name {
				return nil
			}
		}
	}
}
