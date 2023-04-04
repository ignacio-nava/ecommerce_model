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
                        callback: '_navigatorClickListenerClassic'
                    },
                    {
                        event: 'mouseenter',
                        callback: '_setNavigationHoverAnimation'
                    },
                    {
                        event: 'mouseleave',
                        callback: '_setNavigationHoverAnimation'
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
                        callback: '_navigatorClickListenerClassic'
                    },
                    {
                        event: 'mouseenter',
                        callback: '_setNavigationHoverAnimation'
                    },
                    {
                        event: 'mouseleave',
                        callback: '_setNavigationHoverAnimation'
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
                styles: [
                    {
                        name: 'display',
                        value: 'none'
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
                        callback: '_navigatorClickListenerSlide'
                    },
                    {
                        event: 'mouseenter',
                        callback: '_setNavigationHoverAnimation'
                    },
                    {
                        event: 'mouseleave',
                        callback: '_setNavigationHoverAnimation'
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
                    },
                    {
                        event: 'mouseenter',
                        callback: '_setNavigationHoverAnimation'
                    },
                    {
                        event: 'mouseleave',
                        callback: '_setNavigationHoverAnimation'
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
