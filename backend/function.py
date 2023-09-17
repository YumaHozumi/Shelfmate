def extract_isbn_codes(tuple_data):
    isbn_codes = [item for item in tuple_data if isinstance(item, str) and item.startswith("978")]
    return isbn_codes

