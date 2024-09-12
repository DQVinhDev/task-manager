let promise = new Promise((resolve, reject) =>  {
    const i = "promise" ;
    i === "Promise" ? resolve() : reject() ; 
});


promise.then(
    () => {
        console.log("Promise is resolved");
    }
).catch(() => {console.log("Promise is reject")} );
