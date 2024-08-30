import _ from 'lodash';

function getFirstElement<T>(list: _.List<T>): T | undefined {
    return _.first(list); // _.first is a lodash function that gets the first element of an array or list
}

const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirstElement(numbers);
console.log(firstNumber); // Output: 1
