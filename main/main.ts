
async function number() {
    return 123;
}
async function testAsync() {
    return number();
}
async function main() {
    const n = await testAsync()

    console.log(n)
}

main()
