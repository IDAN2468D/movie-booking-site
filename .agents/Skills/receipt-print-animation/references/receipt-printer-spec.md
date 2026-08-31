# Receipt Printer Specification

## Data Model
- `cinemaName`: string
- `movieTitle`: string
- `formatAndHall`: string
- `showtime`: string
- `selectedSeats`: string[]
- `bookingCode`: string
- `items`: Array<{ name: string, qty: number, price: number }>
- `subtotal`: number
- `taxAmount`: number (18% Israeli VAT)
- `total`: number
