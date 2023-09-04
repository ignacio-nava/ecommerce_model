const productRow = {
    element: 'div',
    classList: [
        "flex-row",
        "basket-row",
        "lighter"
    ],
    dataset: {
        role: "content"
    },
    childrens: [
        {
            element: 'div',
            classList: [
                "basket-cell",
                "flex-row",
                "gap-100"
            ],
            dataset: {
                role: "content",
                column: "item"
            },
            childrens: [
                {
                    element: "div",
                    classList: [
                        "w-40",
                        "h-100"
                    ],
                    childrens: [
                        {
                            element: "img",
                            classList: [
                                "w-100",
                                "object-fit-contain"
                            ],
                            attrs: {
                                alt: "product_image",
                                width: "100",
                                height: "100"
                            }
                        }
                    ]
                },
                {
                    element: "div",
                    classList: [
                        "w-60",
                        "h-100"
                    ],
                    childrens: [
                        {
                            element: "p"
                        }
                    ]
                }
            ]
        },
        {
            element: 'div',
            classList: [
                "basket-cell"
            ],
            dataset: {
                role: "content",
                column: "price"
            },
            childrens: [
                {
                    element: "div",
                    childrens: [
                        {
                            element: "p"
                        }
                    ]
                }
            ]
        },
        {
            element: 'div',
            classList: [
                "basket-cell"
            ],
            dataset: {
                role: "content",
                column: "quantity"
            },
            childrens: [
                {
                    element: "div",
                    childrens: [
                        {
                            element: "select",
                            id: "qty-select",
                            classList: [
                                "pad-x-050"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            element: 'div',
            classList: [
                "basket-cell",
                "flex-column",
                "aling-items-center",
                "justify-content-between"
            ],
            dataset: {
                role: "content",
                column: "subtotal"
            },
            childrens: [
                {
                    element: 'div',
                    childrens: [
                        {
                            element: 'p'
                        }
                    ]
                },
                {
                    element: 'div',
                    childrens: [
                        {
                            element: 'button',
                            classList: [
                                "button-romeve-item-basket",
                                "bold"
                            ],
                            attrs: {
                                innerHTML: "REMOVE"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
