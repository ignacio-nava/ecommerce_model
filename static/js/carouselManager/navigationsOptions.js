export const classicNavigatorArrow = {
    element: 'div',
    classes: [
        'carousel-navigation'
    ],
    childrens: [
        {
            element: 'div',
            classes: [
                'carousel-navigation-item',
                'carousel-left'
            ],
            styles: [
                {
                    name: '--side-shadow',
                    value: '-1'
                }
            ],
            attibutes: [
                {
                    name: 'aria-label',
                    value: 'carousel-prev'
                }
            ],
            eventListeners: [
                {
                    event: 'click',
                    callback: '_navigatorClickListener'
                }
            ],
            childrens: [
                {
                    element: 'div',
                    childrens: [
                        {
                            element: 'span',
                            classes: [
                                'carousel-navigation-arrow'
                            ],
                            styles: [
                                {
                                    name: '--right-position',
                                    value: '12px'
                                }
                            ],
                            innerHTML: '&lt'
                        }
                    ]
                }
            ]
        },
        {
            element: 'div',
            classes: [
                'carousel-navigation-item',
                'carousel-right'
            ],
            attibutes: [
                {
                    name: 'aria-label',
                    value: 'carousel-next'
                }
            ],
            eventListeners: [
                {
                    event: 'click',
                    callback: '_navigatorClickListener'
                }
            ],
            childrens: [
                {
                    element: 'div',
                    childrens: [
                        {
                            element: 'span',
                            classes: [
                                'carousel-navigation-arrow'
                            ],
                            styles: [
                                {
                                    name: '--left-position',
                                    value: '12px'
                                }
                            ],
                            innerHTML: '&gt'
                        }
                    ]
                }
            ]
        }
    ]
}
