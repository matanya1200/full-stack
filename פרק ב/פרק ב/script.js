function isWholeNumber(x){
    //if (typeof(X) === 'number' && Number.isInteger(x))
    if(typeof(x) === 'number'){
        if(x % 1 === 0){
            return true;
        }
        else{
            return false;
        }
    }
    return false;
}
let x = 12;
    

function greet(name,where){
    if(where === 'document'){
        document.write('hello ' + name)
    }else if(where === 'alert') {
        alert('hello ' + name)
    }else if(where === 'consule'){
        console.log('hello ' + name)
    } else {
        console.error("Invalid location! Please use 'console', 'alert', or 'document'.");
    }
}

function maxMany(...nums){
    const num = nums.filter(num => typeof num === 'number');

    if(num.length === 0){
        return null;
    }

    return Math.max(...num);
}

console.log(isWholeNumber(x));