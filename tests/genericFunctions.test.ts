import { describe, expect, it } from 'vitest';
import { getInfomaniakItems } from '../nodes/shared/GenericFunctions';

describe('GenericFunctions', () => {
	it('extracts items from data array', () => {
		const items = getInfomaniakItems({ data: [{ id: 1 }, { id: 2 }] });
		expect(items).toHaveLength(2);
	});

	it('wraps object response as array', () => {
		const items = getInfomaniakItems({ data: { id: 99 } });
		expect(items).toEqual([{ id: 99 }]);
	});
});
