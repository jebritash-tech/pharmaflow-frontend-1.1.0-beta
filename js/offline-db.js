const db = new Dexie('pharmacy_db');
db.version(4).stores({

    sales_queue: 'id,synced,created_at',

    medicine_cache: 'id,barcode,name,branch_id',
    user_cache: 'id',
    stock_queue: '++id,medicine_id,quantity,created_at',

});
db.open();

async function saveOfflineSale(sale) {

    return db.sales_queue.add(sale);

}

async function getPendingSales() {

    const allSales =
        await db.sales_queue.toArray();

    return allSales.filter(
        sale => sale.synced === false
    );

}

async function removeOfflineSale(id) {

    return db.sales_queue.delete(id);

}

async function countPendingSales() {

    const allSales =
        await db.sales_queue.toArray();

    return allSales.filter(
        sale => sale.synced === false
    ).length;

}
async function cacheMedicines(medicines) {

    await db.medicine_cache.clear();

    await db.medicine_cache.bulkPut(
        medicines
    );

}

async function getCachedMedicines() {

    return await db.medicine_cache.toArray();

}

async function cacheUser(user) {

    await db.user_cache.clear();

    await db.user_cache.put(user);

}

async function getCachedUser() {

    return await db.user_cache
        .toCollection()
        .first();

}

async function saveStockMovement(data) {

    return await db.stock_queue.add({

        medicine_id: data.medicine_id,

        quantity: data.quantity,

        created_at: new Date().toISOString()

    });

}

async function getPendingStockMovements() {

    return await db.stock_queue.toArray();

}

async function removeStockMovement(id) {

    return await db.stock_queue.delete(id);

}

async function reduceMedicineStock(
    medicineId,
    quantity
) {

    const medicine =
        await db.medicine_cache.get(
            medicineId
        );

    if (!medicine)
        return false;

    medicine.stock =
        Math.max(
            0,
            Number(medicine.stock || 0)
            - Number(quantity)
        );

    await db.medicine_cache.put(
        medicine
    );

    return true;

}