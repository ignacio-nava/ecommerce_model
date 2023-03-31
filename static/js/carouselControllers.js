import { Carousel } from "./carouselManager/carouselMain.js";

const carouselBanners = new Carousel('#carousel-banners')
carouselBanners.build()


const carouselOffers = new Carousel('#carousel-offers')
carouselOffers.build({
    type: 'slide'
})
