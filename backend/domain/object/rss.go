package object

type RSS struct {
	Channel Channel `xml:"channel" json:"result"`
}

type Channel struct {
	Items []Item `xml:"item" json:"items"`
}

type Item struct {
	ISBN        int64  `xml:"http://purl.org/dc/elements/1.1/ identifier" json:"isbn"`
	Title       string `xml:"title" json:"title"`
	Description string `xml:"description" json:"description"`
	Author      string `xml:"author" json:"author"`
	SeriesTitle string `xml:"http://ndl.go.jp/dcndl/terms/ seriesTitle" json:"seriesTitle"`
	Publisher   string `xml:"http://purl.org/dc/elements/1.1/ publisher" json:"publisher"`
	Issued      string `xml:"http://purl.org/dc/terms/ issued" json:"issued"`
}
