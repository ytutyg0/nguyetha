
module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        let storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            }
        }
        storedItem.qty++;
        if(storedItem.item.salePrice){
            storedItem.price = storedItem.item.salePrice*storedItem.qty;
            this.totalQty++;
            this.totalPrice = this.totalPrice + storedItem.item.salePrice;
        }else{
            storedItem.price = storedItem.item.price*storedItem.qty;
            this.totalQty++;
            this.totalPrice = this.totalPrice + storedItem.item.price;
        }
    }
    this.remove = function(item, id){
        let storedItem = this.items[id];
        storedItem.qty--;
        if(storedItem.qty === 0){
            delete this.items[id];
        }
        if(storedItem.item.salePrice){
            storedItem.price = storedItem.item.salePrice*storedItem.qty;
            storedItem.price = storedItem.price.toFixed(2);
            this.totalQty--;
            this.totalPrice -= storedItem.item.salePrice;
        }else{
            storedItem.price = storedItem.item.price*storedItem.qty;
            storedItem.price = storedItem.price.toFixed(2);
            this.totalQty--;
            this.totalPrice -= storedItem.item.price;
        }
    }
    this.generateArray = function(){
        const arr = [];
        for(let id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}