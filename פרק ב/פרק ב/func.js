//שאלה 1
// פונקציה להוספת איבר בסוף מערך
function arrayPush(arr, elm) {
    // הרחבת המערך על ידי שימוש באינדקסים
    arr[arr.length] = elm;
    return arr; // החזרת המערך המעודכן
}

// פונקציה להוצאת איבר מהסוף והחזרתו
function arrayPop(arr) {
    // אם המערך ריק, נחזיר undefined
    if (arr.length === 0) {
        return undefined;
    }

    // שמירת האיבר האחרון
    const lastElement = arr[arr.length - 1];

    // הסרת האיבר האחרון על ידי קיצור המערך
    arr.length = arr.length - 1;

    // החזרת האיבר שהוסר
    return lastElement;
}

// דוגמאות שימוש
let myArray = [1, 2, 3];

// שימוש ב-arrayPush
console.log(arrayPush(myArray, 4)); // פלט: [1, 2, 3, 4]

// שימוש ב-arrayPop
console.log(arrayPop(myArray));     // פלט: 4
console.log(myArray);               // פלט: [1, 2, 3]

// הוצאת איבר ממערך ריק
let emptyArray = [];
console.log(arrayPop(emptyArray));  // פלט: undefined




//שאלה 2
// פונקציה להוספת איבר בתחילת המערך
function arrayUnshift(arr, elm) {
    // יצירת מקום לאיבר החדש על ידי הזזת כל האיברים למיקום הבא
    for (let i = arr.length; i > 0; i--) {
        arr[i] = arr[i - 1];
    }
    // הוספת האיבר החדש במקום הראשון
    arr[0] = elm;
    return arr; // החזרת המערך המעודכן
}

// פונקציה להוצאת האיבר הראשון במערך
function arrayShift(arr) {
    // אם המערך ריק, נחזיר undefined
    if (arr.length === 0) {
        return undefined;
    }

    // שמירת האיבר הראשון
    const firstElement = arr[0];

    // הזזת כל האיברים אחורה
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
    }

    // קיצור המערך על ידי הקטנת אורכו
    arr.length = arr.length - 1;

    // החזרת האיבר שהוסר
    return firstElement;
}

// דוגמאות שימוש
myArray = [1, 2, 3];

// שימוש ב-arrayUnshift
console.log(arrayUnshift(myArray, 0)); // פלט: [0, 1, 2, 3]

// שימוש ב-arrayShift
console.log(arrayShift(myArray));     // פלט: 0
console.log(myArray);                 // פלט: [1, 2, 3]

// הוצאת איבר ממערך ריק
emptyArray = [];
console.log(arrayShift(emptyArray));  // פלט: undefined


//שאלה 3
function arrayJoin(arr) {
    // אם המערך ריק, נחזיר מחרוזת ריקה
    if (arr.length === 0) {
        return "";
    }

    // מחרוזת שתכיל את התוצאה
    let result = "";

    // לולאה להוספת כל איבר למחרוזת התוצאה
    for (let i = 0; i < arr.length; i++) {
        result += arr[i]; // הוספת האיבר למחרוזת

        // אם זה לא האיבר האחרון, נוסיף פסיק
        if (i < arr.length - 1) {
            result += ",";
        }
    }

    return result; // החזרת המחרוזת
}

// דוגמאות שימוש
let arr1 = [1, 2, 3, 4];
let arr2 = ["a", "b", "c"];
let arr3 = [];

console.log(arrayJoin(arr1)); // פלט: "1,2,3,4"
console.log(arrayJoin(arr2)); // פלט: "a,b,c"
console.log(arrayJoin(arr3)); // פלט: ""


//שאלה 4
function arraySplice(arr, start, count, ...items) {
    // מערך חדש שבו נשמרים האיברים שנמחקו
    const removed = [];

    // שלב 1: מחיקת איברים ממקום start
    for (let i = start; i < start + count && i < arr.length; i++) {
        removed.push(arr[i]); // שמירה של האיברים שנמחקו
    }

    // שלב 2: הזזת האיברים שנותרו במערך
    for (let i = start; i < arr.length - count; i++) {
        arr[i] = arr[i + count];
    }

    // קיצור המערך לאחר מחיקת האיברים
    arr.length -= count;

    // שלב 3: הוספת איברים חדשים (אם הועברו)
    if (items.length > 0) {
        for (let i = arr.length - 1; i >= start; i--) {
            arr[i + items.length] = arr[i]; // הזזת האיברים הקיימים
        }
        for (let i = 0; i < items.length; i++) {
            arr[start + i] = items[i]; // הוספת האיברים החדשים
        }
    }

    // החזרת המערך של האיברים שנמחקו
    return removed;
}

// דוגמאות שימוש
arr1 = [1, 2, 3, 4, 5];
console.log(arraySplice(arr1, 1, 2)); // פלט: [2, 3]
console.log(arr1);                   // פלט: [1, 4, 5]

arr2 = [1, 2, 3, 4, 5];
console.log(arraySplice(arr2, 2, 2, 6, 7)); // פלט: [3, 4]
console.log(arr2);                          // פלט: [1, 2, 6, 7, 5]

arr3 = [1, 2, 3];
console.log(arraySplice(arr3, 1, 0, 8, 9)); // פלט: []
console.log(arr3);                          // פלט: [1, 8, 9, 2, 3]


//שאלה 5
function randomFunc() {
    // רשימה של פונקציות מתמטיות
    const functions = [Math.sin, Math.cos, Math.abs, Math.sqrt, Math.cbrt, Math.log, Math.exp];

    // בחירה אקראית של פונקציה מתוך הרשימה
    const randomIndex = Math.floor(Math.random() * functions.length);

    // החזרת הפונקציה שנבחרה
    return functions[randomIndex];
}

// דוגמאות שימוש
for (let i = 0; i < 5; i++) {
    const func = randomFunc(); // קבלת פונקציה אקראית
    const value = Math.random() * 100 - 50; // מספר אקראי בטווח [-50, 50]
    console.log(`Function: ${func.name}, Value: ${value}, Result: ${func(value)}`);
}



//שאלה 6
function maybeInvoke(p, x, f) {
    // בדיקה שההסתברות p היא ערך חוקי (בין 0 ל-1)
    if (p < 0 || p > 1) {
        alert("Error: Probability p must be between 0 and 1.");
        return;
    }

    // הפעלת הפונקציה או הצגת הודעת כישלון על בסיס הסתברות
    if (Math.random() < p) {
        // בהסתברות p: הפעלת הפונקציה f עם הפרמטר x
        return f(x);
    } else {
        // בהסתברות 1-p: הודעת כישלון
        alert("Failure: The function was not invoked.");
        return undefined;
    }
}

// דוגמת פונקציה לשימוש
function square(num) {
    return num * num;
}

// דוגמאות שימוש
console.log(maybeInvoke(0.7, 5, square)); // הפונקציה עשויה לחזור על תוצאת 25 או להציג Alert
console.log(maybeInvoke(0.3, 10, square)); // הסתברות נמוכה להפעלת הפונקציה
maybeInvoke(1.2, 10, square); // הסתברות לא חוקית - הודעת שגיאה



//שאלה 7
function compose(f, g) {
    return function (x) {
        return f(g(x)); // הפעלת g על x ואז הפעלת f על התוצאה
    };
}

// דוגמאות לפונקציות f ו-g
function f(x) {
    return x * x; // f(x) = x^2
}

function g(x) {
    return x + 1; // g(x) = x + 1
}

// יצירת פונקציה חדשה באמצעות compose
const composedFunction = compose(f, g);

// דוגמאות שימוש
console.log(composedFunction(2)); // f(g(2)) = f(2+1) = f(3) = 3^2 = 9
console.log(composedFunction(5)); // f(g(5)) = f(5+1) = f(6) = 6^2 = 36
console.log(composedFunction(-1)); // f(g(-1)) = f(-1+1) = f(0) = 0^2 = 0



//שאלה 8
function sumEvenOdd(numbers) {
    return numbers.reduce(
        (sums, num) => {
            if (num % 2 === 0) {
                sums[0] += num; // סכום המספרים הזוגיים
            } else {
                sums[1] += num; // סכום המספרים האי-זוגיים
            }
            return sums;
        },
        [0, 0] // מערך התחלתי: [סכום זוגיים, סכום אי-זוגיים]
    );
}

// דוגמאות שימוש
const numbers1 = [1, 2, 3, 4, 5, 6];
console.log(sumEvenOdd(numbers1)); // פלט: [12, 9] (סכום זוגיים: 12, סכום אי-זוגיים: 9)

const numbers2 = [10, 15, 20, 25];
console.log(sumEvenOdd(numbers2)); // פלט: [30, 40] (סכום זוגיים: 30, סכום אי-זוגיים: 40)

const numbers3 = [];
console.log(sumEvenOdd(numbers3)); // פלט: [0, 0] (אין מספרים במערך)



//שאלה 9
function multiplyNumbers(items) {
    return items.reduce((product, item) => {
        if (typeof item === "number") {
            return product * item; // הכפלת המספרים
        }
        return product; // התעלמות מפריטים שאינם מספרים
    }, 1); // ערך התחלתי: 1
}

// דוגמאות שימוש
const items1 = [1, 2, "hello", true, 3, null, 4];
console.log(multiplyNumbers(items1)); // פלט: 24 (1 * 2 * 3 * 4)

const items2 = [5, "text", {}, [], 2, -3];
console.log(multiplyNumbers(items2)); // פלט: -30 (5 * 2 * -3)

const items3 = ["a", "b", "c"];
console.log(multiplyNumbers(items3)); // פלט: 1 (אין מספרים, נשאר ערך התחלתי)

const items4 = [];
console.log(multiplyNumbers(items4)); // פלט: 1 (מערך ריק)



//שאלה 10
function arrayMap(f, arr) {
    // יצירת מערך חדש לאחסון התוצאות
    const result = [];

    // לולאה העוברת על כל האיברים במערך
    for (let i = 0; i < arr.length; i++) {
        result[i] = f(arr[i]); // הפעלת הפונקציה f על האיבר הנוכחי ושמירת התוצאה
    }

    return result; // החזרת המערך החדש
}

// דוגמת פונקציה לשימוש
function square(x) {
    return x * x;
}

// דוגמאות שימוש
const numbers = [1, 2, 3, 4];
console.log(arrayMap(square, numbers)); // פלט: [1, 4, 9, 16]

const strings = ["a", "b", "c"];
console.log(arrayMap(str => str.toUpperCase(), strings)); // פלט: ["A", "B", "C"]


//שאלה 11
function arrayFilter(f, arr) {
    // יצירת מערך חדש לאחסון האיברים שעוברים את הבדיקה
    const result = [];

    // לולאה העוברת על כל איברי המערך
    for (let i = 0; i < arr.length; i++) {
        if (f(arr[i])) { // אם הפונקציה f מחזירה true עבור האיבר
            result.push(arr[i]); // הוספת האיבר למערך התוצאה
        }
    }

    return result; // החזרת המערך החדש
}

// דוגמת פונקציה לשימוש
function isEven(x) {
    return x % 2 === 0; // בודק אם מספר הוא זוגי
}

// דוגמאות שימוש
numbers = [1, 2, 3, 4, 5, 6];
console.log(arrayFilter(isEven, numbers)); // פלט: [2, 4, 6]

const words = ["apple", "banana", "cherry", "date"];
console.log(arrayFilter(word => word.length > 5, words)); // פלט: ["banana", "cherry"]

//שאלה 12 + 13
function personFactory(firstName, lastName, birthYear, hobbiesArray) {
    return {
        firstName: firstName,
        lastName: lastName,
        birthYear: birthYear,
        hobbies: hobbiesArray,
        friends: [], // מערך לרשימת החברים

        // פונקציה לחישוב גיל
        calculateAge: function () {
            const currentYear = new Date().getFullYear();
            return currentYear - this.birthYear;
        },

        // פונקציה לבחירת תחביב אקראי
        randomHobby: function () {
            if (this.hobbies.length === 0) {
                return "No hobbies available.";
            }
            const randomIndex = Math.floor(Math.random() * this.hobbies.length);
            return this.hobbies[randomIndex];
        },

        // הוספת תחביב
        addHobby: function (hobby) {
            if (!this.hobbies.includes(hobby)) {
                this.hobbies.push(hobby);
                console.log(`${hobby} added to ${this.firstName}'s hobbies.`);
            } else {
                console.log(`${hobby} is already in ${this.firstName}'s hobbies.`);
            }
        },

        // מחיקת תחביב
        removeHobby: function (hobby) {
            const index = this.hobbies.indexOf(hobby);
            if (index !== -1) {
                this.hobbies.splice(index, 1);
                console.log(`${hobby} removed from ${this.firstName}'s hobbies.`);
            } else {
                console.log(`${hobby} not found in ${this.firstName}'s hobbies.`);
            }
        },

        // יצירת חברות עם אדם אחר
        addFriend: function (person) {
            if (!this.friends.includes(person)) {
                this.friends.push(person);
                person.friends.push(this); // עדכון החברות גם באדם השני
                console.log(`${this.firstName} and ${person.firstName} are now friends.`);
            } else {
                console.log(`${this.firstName} and ${person.firstName} are already friends.`);
            }
        },

        // היפרדות מאדם אחר
        removeFriend: function (person) {
            const index = this.friends.indexOf(person);
            if (index !== -1) {
                this.friends.splice(index, 1);
                const friendIndex = person.friends.indexOf(this);
                if (friendIndex !== -1) {
                    person.friends.splice(friendIndex, 1); // עדכון ההיפרדות גם אצל האדם השני
                }
                console.log(`${this.firstName} and ${person.firstName} are no longer friends.`);
            } else {
                console.log(`${this.firstName} and ${person.firstName} are not friends.`);
            }
        }
    };
}

// יצירת אנשים באמצעות personFactory
const alice = personFactory("Alice", "Smith", 1990, ["Reading", "Traveling"]);
const bob = personFactory("Bob", "Johnson", 1985, ["Swimming", "Cycling"]);
const charlie = personFactory("Charlie", "Brown", 2000, []);

// דוגמאות שימוש
alice.addHobby("Cooking");
alice.removeHobby("Traveling");

alice.addFriend(bob);
alice.addFriend(charlie);
alice.removeFriend(bob);

console.log(`${alice.firstName}'s friends:`, alice.friends.map(friend => friend.firstName));
console.log(`${bob.firstName}'s friends:`, bob.friends.map(friend => friend.firstName));
