import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import App, { Input, Item, List, SearchForm } from './App';

/* BEGIN EXAMPLE */
// test suite -> describe
describe('truth + false', () => {
  // test cases -> it
  it('true to equal true', () => {
    // test assertion -> expect
    expect(true).toBe(true);
  });

  // test case
  it('false to equal false', () => {
    // test assertion
    expect(false).toBe(false);
  });
});
/* END EXAMPLE */

// TEST - ITEM COMPONENT
describe('Item component', () => {
  // dummy item used for testing
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    objectID: 0,
  };
  // mock of actual function to test
  const handleRemoveItem = jest.fn();

  let component;
  // before each test case, create a new component
  beforeEach(() => {
    // component we will be testing
    component = renderer.create(
      <Item item={item} removeItem={handleRemoveItem} />
    );
  });

  // testing items are rendereed properly
  it('renders all properties', () => {
    // testing if 'href' prop of 'a' tag is equal to correct url.
    // (testing html attributes)
    expect(component.root.findByType('a').props.href).toEqual(
      'https://reactjs.org/'
    );

    // test title (testing text)
    expect(component.root.findAllByProps({ children: 'React' }).length).toEqual(
      1
    );

    // test if author is correct.
    // checking if there is one element with the items author property
    expect(
      component.root.findAllByProps({ children: 'Jordan Walke' }).length
    ).toEqual(1);
  });

  // testing if button calls 'removeItem' on click
  it('calls removeItem on button click', () => {
    // simulates button click
    component.root.findByType('button').props.onClick();

    // asserts number of times function was called
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    // verifies correct arguments were passed to it
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    expect(component.root.findAllByType(Item).length).toEqual(1);
  });
});

// TEST - LIST COMPONENT
describe('List component', () => {
  // list that will be used for testing
  const list = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  // dummy function (mock of actual function)
  const handleRemoveItem = jest.fn();

  // create new component before each test
  let component;
  beforeEach(() => {
    component = renderer.create(
      <List list={list} removeItem={handleRemoveItem} />
    );
  });

  // check both items render
  it('both items in list render', () => {
    expect(component.root.findAllByType(Item).length).toEqual(2);
  });
});

// TEST - SEARCHFORM COMPONENT
describe('SearchForm component', () => {
  // props of SeachForm component
  const searchFormProps = {
    value: 'React',
    searchTerm: 'React',
    handleInputChange: jest.fn(),
    handleSearchSubmit: jest.fn(),
  };

  // create new SearchForm component before every test case
  let component;
  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });

  // check if Item receives correct props (value, searchTerm) from SearchForm
  it('SearchForm sends correct props to Item', () => {
    const val = component.root.findByType(Input).props.value;
    const st = component.root.findByType(Input).props.searchTerm;

    expect(val).toEqual('React');
    expect(st).toEqual('React');
  });
});
