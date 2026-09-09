function show(id, value) {
    document.getElementById(id).textContent = JSON.stringify(value, null, 2);
  }

// Variables and Data Types
  const name = "Alisher";
  const age = 21;
  const isActive = true;
  const courses = ["Django", "React", "Cybersecurity"];
  const address = { city: "Almaty", street: "Tole Bi" };
  const NullValue = null;
  let UndefinedValue;
  let sentence = `My name is ${name}, I am ${age} years old.`;

  show("out1", {
    name, typeofName: typeof name,
    age, typeofAge: typeof age,
    isActive,
    courses,
    address,
    NullValue, typeofNull: typeof NullValue,
    UndefinedValue, typeofUndefined: typeof UndefinedValue,
    sentence
  });

  // Arrays
  const nums = [3, 7, 2, 10, 5];
  const doubled = nums.map(n => n * 2);
  const greaterThan5 = nums.filter(n => n > 5);
  const firstGreaterThan5 = nums.find(n => n > 5);
  const sum = nums.reduce((acc, n) => acc + n, 0);
  const has10 = nums.includes(10);

  show("out2", { original: nums, doubled, greaterThan5, firstGreaterThan5, sum, has10 });

  // Arrays of Objects
  const students = [
    { id: 1, name: "Anna", grade: 85 },
    { id: 2, name: "John", grade: 62 },
    { id: 3, name: "Sara", grade: 91 },
    { id: 4, name: "Mike", grade: 55 },
  ];
  const passingStudents = students.filter(s => s.grade >= 70);
  const studentNames = students.map(s => s.name);
  const studentById3 = students.find(s => s.id === 3);
  const topStudent = students.reduce((best, s) => (s.grade > best.grade ? s : best));
  const averageGrade = students.reduce((acc, s) => acc + s.grade, 0) / students.length;
  const withPassedFlag = students.map(s => ({ ...s, passed: s.grade >= 60 }));

  show("out3", { passingStudents, studentNames, studentById3, topStudent, averageGrade, withPassedFlag });

  // Objects
  const user = { id: 1, name: "Dias", age: 21, address: { city: "Ust-Kamenogorsk", street: "Utepova" } };
  user.age = 26;
  const userWithEmail = { ...user, email: "dias@example.com" };
  const { street, ...addressWithoutStreet } = userWithEmail.address;
  const userWithoutStreet = { ...userWithEmail, address: addressWithoutStreet };
  const { name: destructuredName, age: destructuredAge } = userWithoutStreet;
  const { address: { city: destructuredCity } } = userWithoutStreet;
  const { name: userName } = userWithoutStreet;

  show("out4", { userWithoutStreet, destructuredName, destructuredAge, destructuredCity, userName });

  // Values and References
  const original = { name: "Alice", score: 10 };
  const copy = original;
  copy.score = 99;

  const original2 = { name: "Alice", score: 10 };
  const realCopy = { ...original2 };
  realCopy.score = 50;

  const userNested = { name: "Alice", address: { city: "Almaty" } };
  const shallowCopyUser = { ...userNested };
  shallowCopyUser.address.city = "Astana";

  const userNested2 = { name: "Alice", address: { city: "Almaty" } };
  const deepCopyUser = { ...userNested2, address: { ...userNested2.address } };
  deepCopyUser.address.city = "Astana";

  show("out5", {
    "original.score after copy.score = 99": original.score,
    "original2 (untouched)": original2,
    "realCopy": realCopy,
    "shallow copy: original.address.city too": userNested.address.city,
    "deep copy: original stays": userNested2.address.city,
    "deep copy: copy changes": deepCopyUser.address.city
  });

  // Functions
  function isEven(n) { return n % 2 === 0; }
  const isEvenArrow = n => n % 2 === 0;
  function getFullName(first, last) { return first + " " + last; }
  const calculatePrice = (price, qty) => price * qty;
  const calculateDiscount = (price, percent) => price - (price * percent) / 100;
  const getMax = (a, b) => (a > b ? a : b);

  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  function calculate(a, b, operation) { return operation(a, b); }

  show("out6", {
    isEven: isEven(4), isEvenArrow: isEvenArrow(7),
    fullName: getFullName("Alisher", "Toleutayev"),
    price: calculatePrice(100, 3),
    discountedPrice: calculateDiscount(200, 10),
    max: getMax(5, 9),
    "calculate(5,3,add)": calculate(5, 3, add),
    "calculate(5,3,multiply)": calculate(5, 3, multiply)
  });

  // Scope
  const message = "global";
  let scopeLog = [];
  function scopeDemo() {
    const message = "function";
    scopeLog.push("inside function: " + message);
    if (true) {
      const message = "block";
      scopeLog.push("inside block: " + message);
    }
    scopeLog.push("back in function: " + message);
  }
  scopeDemo();
  scopeLog.push("global: " + message);

  {
    var varVariable = "var value";
  }
  scopeLog.push("var visible outside block: " + varVariable);

  show("out8", scopeLog);

  // Closure
  function createCounter() {
    let count = 0;
    return function () {
      count += 1;
      return count;
    };
  }
  const counterA = createCounter();
  const counterACalls = [counterA(), counterA(), counterA()];
  const counterB = createCounter();
  const counterBFirstCall = counterB();

  function createAdder(value) {
    return function (n) { return n + value; };
  }
  const addFive = createAdder(5);

  show("out9", {
    counterA: counterACalls,
    "counterB has its own count": counterBFirstCall,
    "addFive(10)": addFive(10),
    "addFive(20)": addFive(20)
  });

  // Destructuring, Spread, Rest
  const numbers = [10, 20, 30, 40];
  const [first, second] = numbers;
  const userObj = { id: 1, name: "Anna", age: 21 };
  const { name: objName, age: objAge } = userObj;
  const numbersWith50 = [...numbers, 50];
  const olderUser = { ...userObj, age: 22 };
  const userWithEmail2 = { ...userObj, email: "anna@example.com" };
  const combined = [...[1, 2, 3], ...[4, 5, 6]];
  function sumRest(...nums) { return nums.reduce((acc, n) => acc + n, 0); }

  show("out10", {
    first, second, objName, objAge,
    numbersWith50, originalNumbers: numbers,
    olderUser, originalUser: userObj,
    userWithEmail2,
    combined,
    "sumRest(1,2)": sumRest(1, 2),
    "sumRest(1,2,3,4)": sumRest(1, 2, 3, 4)
  });

  // Optional Chaining and Default Values
  const userWithAddress = { name: "Ali", address: { city: "Almaty" } };
  const userWithoutAddress = { name: "Adil" };
  const testValues = [0, "", false, null, undefined];
  const orVsNullish = testValues.map(v => ({
    value: JSON.stringify(v),
    "|| fallback": v || "fallback",
    "?? fallback": v ?? "fallback"
  }));

  show("out11", {
    "userWithAddress city": userWithAddress.address?.city,
    "userWithoutAddress city": userWithoutAddress.address?.city,
    "with ?? default": userWithoutAddress.address?.city ?? "City not specified",
    "|| vs ?? comparison": orVsNullish
  });

  // Final Task
  const finalStudents = [
    { id: 1, name: "Alisher", age: 20, grades: [85, 90, 78] },
    { id: 2, name: "Samat", age: 22, grades: [55, 60, 58] },
    { id: 3, name: "Alimzhan", age: 21, grades: [91, 95, 89] },
    { id: 4, name: "Doszhan", age: 23, grades: [40, 50, 45] },
    { id: 5, name: "Dias", age: 20, grades: [70, 72, 68] },
  ];
  const getAverage = grades => grades.reduce((acc, g) => acc + g, 0) / grades.length;
  const getStudentAverage = student => getAverage(student.grades);
  const PASS_THRESHOLD = 60;
  const getPassedStudents = list => list.filter(s => getStudentAverage(s) >= PASS_THRESHOLD);
  const getStudentNames = list => list.map(s => s.name);
  const findStudent = (list, id) => list.find(s => s.id === id);
  const getTopStudent = list => list.reduce((best, s) => (getStudentAverage(s) > getStudentAverage(best) ? s : best));

  const summary = finalStudents.map(s => ({
    id: s.id,
    name: s.name,
    average: getAverage(s.grades),
    passed: getAverage(s.grades) >= PASS_THRESHOLD
  }));

  show("out12", {
    passedNames: getStudentNames(getPassedStudents(finalStudents)),
    allNames: getStudentNames(finalStudents),
    "findStudent(id=3)": findStudent(finalStudents, 3),
    topStudent: getTopStudent(finalStudents).name,
    summary
  });