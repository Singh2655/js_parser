function sum(val1,val2){
    return val1+val2;
}

function info(name){
    const age=sum(10,11)
    const profession="Javascript developer"
    const message=`hello ${name}, you are ${age} years old ${profession}.`
    console.log(message)
}

info("Shaurya")
