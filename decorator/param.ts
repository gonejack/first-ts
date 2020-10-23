function DecoratedParameter(
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
) {
    console.log(target);
    console.log(propertyKey);
    console.log(parameterIndex);
}

class TargetDemo {
    public foo1(baz: any, @DecoratedParameter bar: any) {
        console.log("Class method foo");
    }
}

const test = new TargetDemo();
test.foo1("class baz", "class bar");
