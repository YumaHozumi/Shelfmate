package object

import (
	"encoding/xml"
	"fmt"
	"net/http"
	"strconv"
)

type RSS struct {
	Channel Channel `xml:"channel" json:"result"`
}

type Channel struct {
	Items []Item `xml:"item" json:"items"`
}

type Item struct {
	Title          string `xml:"title" json:"title"`
	Detail         string `json:"detail"` // 読み込むのはカスタム関数で
	Author         string `xml:"author" json:"author"`
	PublicDate     string `xml:"pubDate" json:"public_date"`
	ISBNIdentifier int64  `json:"isbn"`
	OrderNumber    int    `xml:"volume" json:"order_number"`
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
						var isbn int64
						if err := d.DecodeElement(&isbn, &t); err != nil {
							return err
						}
						item.ISBNIdentifier = isbn

						if strISBN := strconv.FormatInt(isbn, 10); strISBN != "" {
							picImage := "https://iss.ndl.go.jp/thumbnail/" + strISBN

							resp, err := http.Head(picImage)
							if err != nil {
								return err
							}
							defer resp.Body.Close()
							fmt.Println(resp)

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
