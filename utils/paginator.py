def get_pages_to_display(num_pages, range_pages, current_page):
    '''Adjusts the length of pages available to a given range:

    - num_pages (int): number of pages availables

    - range_pages(int): range of pages to display [it will be adjusted to num_pages]

    - current_page (int): current page [it will be centralized if is possible]
    '''
    correction = 0
    if num_pages < range_pages:
        range_pages = num_pages
    if range_pages // 2 > range_pages - current_page:
        correction = range_pages // 2 - (range_pages - current_page)
        if correction + range_pages >= num_pages:
            correction += num_pages - (correction + range_pages)
    return range(correction+1, range_pages+correction+1)
