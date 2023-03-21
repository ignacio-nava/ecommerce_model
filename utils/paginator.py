def get_pages_to_display(num_pages, range_pages, current_page):
    correction = 0
    if range_pages // 2 > range_pages - current_page:
        correction = range_pages // 2 - (range_pages - current_page)
        if correction + range_pages >= num_pages:
            correction += num_pages - (correction + range_pages)
    return range(correction+1, range_pages+correction+1)
