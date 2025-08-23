import { Hono } from 'hono'
import { userRouter } from './routes/user';

import { cors } from 'hono/cors'
import { productRouter } from './routes/product';
import { cartRouter } from './routes/cart';
import { orderRouter } from './routes/order';

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use('/api/*', cors())
app.route('/api/v1/user', userRouter)
app.route('/api/v1/product', productRouter)
app.route('/api/v1/cart', cartRouter)
app.route('/api/v1/order', orderRouter)
export default app