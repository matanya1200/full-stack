// פונקציית הבנאי Counter
class Counter{
    constructor(buttonId){
        this.count = 0; 

        this.button = document.getElementById(buttonId);

        this.button.addEventListener("click", () => this.inc());

        this.button.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown"){
                this.dec();
            }
            else if(event.key === "ArrowUp"){
                this.inc();
            }
            else if(event.key === " "){
                event.preventDefault();
                this.reset();
            }
        });
    }

    inc(){
        this.count++;
        this.updateDisplay();
    };

    dec(){
        this.count--;
        this.updateDisplay();
    }

    reset(){
        this.count = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        this.button.textContent = this.count;
        this.button.style.backgroundColor = this.count >= 0 ? "green" : "red";
    }
    
}

// יצירת מונים בלתי תלויים
const counter1 = new Counter("counter1-btn");
const counter2 = new Counter("counter2-btn");
const counter3 = new Counter("counter3-btn");
