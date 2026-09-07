import { describe, it, expect, beforeEach } from 'vitest';
import { useProductiveConcessionStore } from '@/lib/store/productiveConcessionStore';
import { EXPRESS_BUNDLES, PRODUCTIVE_CONCESSION_ITEMS } from '@/lib/data/productiveConcessionCatalog';
import { ProductiveOrderSchema } from '@/lib/validations/productive-concession';

describe('Productive Concession Suite (Sprint 169)', () => {
  beforeEach(() => {
    useProductiveConcessionStore.getState().clearCart();
    useProductiveConcessionStore.getState().setDietaryTag('ALL');
    useProductiveConcessionStore.getState().setSearchQuery('');
    useProductiveConcessionStore.getState().setDeliveryMode('COUNTER_EXPRESS');
  });

  it('initializes with an empty cart and default filters', () => {
    const state = useProductiveConcessionStore.getState();
    expect(state.cart).toHaveLength(0);
    expect(state.activeDietaryTag).toBe('ALL');
    expect(state.deliveryMode).toBe('COUNTER_EXPRESS');
    expect(state.searchQuery).toBe('');
  });

  it('adds an item to the cart with spice and drink customization', () => {
    const popcorn = PRODUCTIVE_CONCESSION_ITEMS[0];
    useProductiveConcessionStore.getState().addItem(popcorn, 'TRUFFLE', 'COLA_ZERO');

    const cart = useProductiveConcessionStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].itemId).toBe(popcorn.id);
    expect(cart[0].selectedSpice).toBe('TRUFFLE');
    expect(cart[0].selectedDrink).toBe('COLA_ZERO');
    expect(cart[0].quantity).toBe(1);
  });

  it('increments quantity when adding the same customized item twice', () => {
    const popcorn = PRODUCTIVE_CONCESSION_ITEMS[0];
    useProductiveConcessionStore.getState().addItem(popcorn, 'CHEDDAR');
    useProductiveConcessionStore.getState().addItem(popcorn, 'CHEDDAR');

    const cart = useProductiveConcessionStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('updates item quantity and removes it when quantity drops to 0', () => {
    const snack = PRODUCTIVE_CONCESSION_ITEMS[1];
    useProductiveConcessionStore.getState().addItem(snack);

    const cartItem = useProductiveConcessionStore.getState().cart[0];
    useProductiveConcessionStore.getState().updateQuantity(cartItem.cartId, 1);
    expect(useProductiveConcessionStore.getState().cart[0].quantity).toBe(2);

    useProductiveConcessionStore.getState().updateQuantity(cartItem.cartId, -2);
    expect(useProductiveConcessionStore.getState().cart).toHaveLength(0);
  });

  it('adds an express bundle with all bundled items', () => {
    const soloBundle = EXPRESS_BUNDLES[0]; // items: [1, 3]
    useProductiveConcessionStore.getState().addBundle(soloBundle);

    const cart = useProductiveConcessionStore.getState().cart;
    expect(cart).toHaveLength(soloBundle.itemIds.length);
    const totalAddedPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    expect(totalAddedPrice).toBe(50); // 32 + 18
  });

  it('switches delivery mode correctly', () => {
    useProductiveConcessionStore.getState().setDeliveryMode('IN_SEAT');
    expect(useProductiveConcessionStore.getState().deliveryMode).toBe('IN_SEAT');
  });

  it('validates a complete productive order via Zod schema', () => {
    const popcorn = PRODUCTIVE_CONCESSION_ITEMS[0];
    const validOrderPayload = {
      items: [
        {
          cartId: 'item-1-truffle',
          itemId: popcorn.id,
          name: popcorn.name,
          price: popcorn.price,
          quantity: 2,
          selectedSpice: 'TRUFFLE' as const,
          calories: popcorn.calories,
        },
      ],
      deliveryMode: 'IN_SEAT' as const,
      seatNumber: 'D12',
      hallNumber: 'אולם 04',
      totalPrice: 64,
      vatAmount: 11.52,
      totalCalories: 760,
    };

    const result = ProductiveOrderSchema.safeParse(validOrderPayload);
    expect(result.success).toBe(true);
  });

  it('rejects an empty order payload via Zod schema', () => {
    const emptyOrder = {
      items: [],
      deliveryMode: 'COUNTER_EXPRESS' as const,
      hallNumber: 'אולם 04',
      totalPrice: 0,
      vatAmount: 0,
      totalCalories: 0,
    };

    const result = ProductiveOrderSchema.safeParse(emptyOrder);
    expect(result.success).toBe(false);
  });
});
