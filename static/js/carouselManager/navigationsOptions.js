export const navigationOptions = {
    classic: {
        element: 'div',
        classes: [
            'carousel-navigation'
        ],
        childrens: [
            {
                element: 'div',
                classes: [
                    'carousel-navigation-item',
                    'carousel-navigation-item-classic',
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
                        callback: '_navigatorClickListenerClassic'
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
                    'carousel-navigation-item-classic',
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
                        callback: '_navigatorClickListenerClassic'
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
    },
    slide: {
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
                attibutes: [
                    {
                        name: 'aria-label',
                        value: 'carousel-prev'
                    }
                ],
                eventListeners: [
                    {
                        event: 'click',
                        callback: '_navigatorClickListenerSlide'
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
                                        value: '50%'
                                    },
                                    {
                                        name: 'transform',
                                        value: 'translate(-50%, -50%)'
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
                        callback: '_navigatorClickListenerSlide'
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
                                        value: '50%'
                                    },
                                    {
                                        name: 'transform',
                                        value: 'translate(-50%, -50%)'
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
}
