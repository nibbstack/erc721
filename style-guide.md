
# Style Guide

## Introduction

This guide is based on solidity style guide that can be found here:
https://github.com/ethereum/solidity/blob/v0.5.1/docs/style-guide.rst. It mostly follows the guide
line but with slight changes and more specific restrictions. 

This guide is intended to provide coding conventions for writing solidity code.
This guide should be thought of as an evolving document that will change over
time as useful conventions are found and old conventions are rendered obsolete.

## Code Layout

### Indentation

Use 2 spaces per indentation level.

### Tabs or Spaces

Spaces are the preferred indentation method.

Mixing tabs and spaces should be avoided.

### Multiple contracts in the same file

Each smart contract should be in its own file.

### Maximum Line Length

Maximum line length is 100 characters.

### Function Calls

Yes

    thisFunctionCallIsReallyLong(
      longArgument1,
      longArgument2,
      longArgument3
    );

    shortFunctionCall(arg1);

No

    thisFunctionCallIsReallyLong(longArgument1,
                                  longArgument2,
                                  longArgument3
    );
    
    thisFunctionCallIsReallyLong(longArgument1,
        longArgument2,
        longArgument3
    );
    
    thisFunctionCallIsReallyLong(
        longArgument1, longArgument2,
        longArgument3
    );
    
    thisFunctionCallIsReallyLong(
    longArgument1,
    longArgument2,
    longArgument3
    );
    
    thisFunctionCallIsReallyLong(
        longArgument1,
        longArgument2,
        longArgument3);

#### Assignment Statements

Yes

    thisIsALongNestedMapping[being][set][to_some_value] = someFunction(
      argument1,
      argument2,
      argument3,
      argument4
    );

No

    thisIsALongNestedMapping[being][set][to_some_value] = someFunction(argument1,
                                                                       argument2,
                                                                       argument3,
                                                                       argument4);

#### Event Definitions and Event Emitters

Yes

    event ShortOneArg(
      address sender
    );
    
    event LongAndLotsOfArgs(
      address sender,
      address recipient,
      uint256 publicKey,
      uint256 amount,
      bytes32[] options
    );
    
    LongAndLotsOfArgs(
      sender,
      recipient,
      publicKey,
      amount,
      options
    );

No

    event ShortOneArg(address sender);
    
    event LongAndLotsOfArgs(address sender,
                            address recipient,
                            uint256 publicKey,
                            uint256 amount,
                            bytes32[] options);
    
    LongAndLotsOfArgs(sender,
                      recipient,
                      publicKey,
                      amount,
                      options);



### Source File Encoding

UTF-8 or ASCII encoding is preferred.

### Imports

Import statements should always be placed at the top of the file.

### Code ordering

Functions and declarations should be grouped according to their visibility and ordered:

- constructor
- fallback function (if exists)
- external
- public
- internal
- private

Within a grouping, place the `view` and `pure` functions last.

Yes

    pragma solidity >=0.4.0 <0.6.0;
    
    contract A {
      using SafeMath for uint256;
    
      uint256 someVariable;
    
      event SomeEvent(
        uint256 arg1
      );
    
      modifier SomeModifier(
        uint256 arg1
      ) {
        // some check
        _;
      }
    
      constructor() 
        public 
      {
          // ...
      }
    
      function() 
        external 
      {
          // ...
      }
    
      // External functions
      // ...
    
      // External functions that are view
      // ...
    
      // External functions that are pure
      // ...
    
      // Public functions
      // ...
    
      // Internal functions
      // ...
    
      // Private functions
      // ...
    }

No

    pragma solidity >=0.4.0 <0.6.0;
    
    contract A {
    
      // External functions
      // ...
    
      function() 
        external 
      {
          // ...
      }
    
      // Private functions
      // ...
    
      // Public functions
      // ...
    
      constructor()
        public 
      {
          // ...
      }
    
      // Internal functions
      // ...
    }

### Whitespace in Expressions

Avoid extraneous whitespace in the following  situations:

Immediately inside parenthesis, brackets or braces, with the exception of single line function declarations.

Yes

    spam(ham[1], Coin({name: "ham"}));

No::

    spam( ham[ 1 ], Coin( { name: "ham" } ) );

Exception

    function singleLine() public { spam(); }


More than one space around an assignment or other operator to align with
  another:

Yes

    x = 1;
    y = 2;
    long_variable = 3;

No

    x             = 1;
    y             = 2;
    long_variable = 3;


Control Structures

The braces denoting the body of a contract, library, functions and structs
should:

* open on the same line as the declaration
* close on their own line at the same indentation level as the beginning of the
  declaration.
* The opening brace should be proceeded by a single space.

Yes

    pragma solidity >=0.4.0 <0.6.0;
    
    contract Coin {
      struct Bank {
        address owner;
        uint balance;
      }
    }

No

    pragma solidity >=0.4.0 <0.6.0;
    
    contract Coin
    {
      struct Bank {
        address owner;
        uint balance;
      }
    }

The same recommendations apply to the control structures `if`, `else`, `while`,
and `for`.

Additionally there should be a single space between the control structures
`if`, `while`, and `for` and the parenthetic block representing the
conditional, as well as a single space between the conditional parenthetic
block and the opening brace.

Yes

    if (...) {
      ...
    }
    
    for (...) {
      ...
    }

No

    if (...)
    {
      ...
    }
    
    while(...){
    }
    
    for (...) {
      ...;}

For control structures whose body contains a single statement, omitting the
braces is ok *if* the statement is contained on a single line.

Yes

    if (x < 10)
      x += 1;

No

    if (x < 10)
      someArray.push(Coin({
        name: 'spam',
        value: 42
      }));

For `if` blocks which have an `else` or `else if` clause, the `else` should be
placed on the same line as the `if`'s closing brace. This is an exception compared
to the rules of other block-like structures.

Yes

    if (x < 3) {
      x += 1;
    } else if (x > 7) {
      x -= 1;
    } else {
      x = 5;
    }


    if (x < 3)
      x += 1;
    else
      x -= 1;

No

    if (x < 3) {
      x += 1;
    }
    else {
      x -= 1;
    }

### Function Declaration

For every function declarations, it is recommended to drop each argument onto
it's own line at the same indentation level as the function body.  The closing
parenthesis and opening bracket should be placed on their own line as well at
the same indentation level as the function declaration.

Yes

    function thisFunctionHasNoArguments()
      public
    {
      doSomething();
    }
    
    function thisFunctionHasAnArgument(
      address a
    )
      public
    {
      doSomething();
    }
    
    function thisFunctionHasLotsOfArguments(
      address a,
      address b,
      address c,
      address d,
      address e,
      address f
    )
      public
    {
      doSomething();
    }

No

    function thisFunctionHasNoArguments() public
    {
      doSomething();
    }
    
    function thisFunctionHasAnArgument(address a) public
    {
      doSomething();
    }
    
    function thisFunctionHasLotsOfArguments(address a, address b, address c,
        address d, address e, address f) public {
        doSomething();
    }
    
    function thisFunctionHasLotsOfArguments(address a,
                                            address b,
                                            address c,
                                            address d,
                                            address e,
                                            address f) public {
        doSomething();
    }
    
    function thisFunctionHasLotsOfArguments(
        address a,
        address b,
        address c,
        address d,
        address e,
        address f) public {
        doSomething();
    }

If a function declaration has modifiers, then each modifier should be
dropped to its own line.

Yes

    function thisFunctionNameIsReallyLong(
      address x,
      address y,
      address z
    )
      public
      onlyowner
      priced
      returns (address)
    {
        doSomething();
    }
    
    function thisFunctionNameIsReallyLong(
      address x,
      address y,
      address z,
    )
      public
      onlyowner
      priced
      returns (address)
    {
      doSomething();
    }

No

    function thisFunctionNameIsReallyLong(address x, address y, address z)
                                          public
                                          onlyowner
                                          priced
                                          returns (address) {
        doSomething();
    }
    
    function thisFunctionNameIsReallyLong(address x, address y, address z)
        public onlyowner priced returns (address)
    {
        doSomething();
    }
    
    function thisFunctionNameIsReallyLong(address x, address y, address z)
        public
        onlyowner
        priced
        returns (address) {
        doSomething();
    }

Multiline output parameters and return statements should follow the same style.

Yes

    function thisFunctionNameIsReallyLong(
      address a,
      address b,
      address c
    )
      public
      returns (
        address someAddressName,
        uint256 LongArgument,
        uint256 Argument
      )
    {
      doSomething()
    
      return (
        veryLongReturnArg1,
        veryLongReturnArg2,
        veryLongReturnArg3
      );
    }

No

    function thisFunctionNameIsReallyLong(
        address a,
        address b,
        address c
    )
        public
        returns (address someAddressName,
                 uint256 LongArgument,
                 uint256 Argument)
    {
        doSomething()
    
        return (veryLongReturnArg1,
                veryLongReturnArg1,
                veryLongReturnArg1);
    }

For constructor functions on inherited contracts whose bases require arguments,
it is recommended to drop the base constructors onto new lines in the same
manner as modifiers.

Yes

    pragma solidity >=0.4.0 <0.6.0;
    
    // Base contracts just to make this compile
    contract B {
    
      constructor(
        uint
      ) 
        public 
      {
      }
    
    }
    
    contract C {
    
      constructor(
        uint,
        uint
      ) 
        public
      {
      }
    
    }
    
    contract D {
    
      constructor(
        uint
      )
        public
      {
      }
    
    }
    
    contract A is
      B, C, D 
    {
      uint x;
    
      constructor(
        uint param1,
        uint param2,
        uint param3,
        uint param4,
        uint param5
      )
        B(param1)
        C(param2, param3)
        D(param4)
        public
      {
        // do something with param5
        x = param5;
      }
    }

No

    pragma solidity >=0.4.0 <0.6.0;
    
    // Base contracts just to make this compile
    contract B {
        constructor(uint) public {
        }
    }
    contract C {
        constructor(uint, uint) public {
        }
    }
    contract D {
        constructor(uint) public {
        }
    }
    
    contract A is B, C, D {
        uint x;
    
        constructor(uint param1, uint param2, uint param3, uint param4, uint param5)
        B(param1)
        C(param2, param3)
        D(param4)
        public
        {
            x = param5;
        }
    }
    
    contract X is B, C, D {
        uint x;
    
        constructor(uint param1, uint param2, uint param3, uint param4, uint param5)
            B(param1)
            C(param2, param3)
            D(param4)
            public {
            x = param5;
        }

### Mappings

In variable declarations, do not separate the keyword `mapping` from its
type by a space. Do not separate any nested `mapping` keyword from its type by
whitespace.

Yes

    mapping(uint => uint) map;
    mapping(address => bool) registeredAddresses;
    mapping(uint => mapping(bool => Data[])) public data;
    mapping(uint => mapping(uint => s)) data;

No

    mapping (uint => uint) map;
    mapping( address => bool ) registeredAddresses;
    mapping (uint => mapping (bool => Data[])) public data;
    mapping(uint => mapping (uint => s)) data;

### Variable Declarations

Declarations of array variables should not have a space between the type and
the brackets.

Yes

    uint[] x;

No

    uint [] x;


###  Other Recommendations

* Strings should be quoted with double-quotes instead of single-quotes.

Yes

    str = "foo";
    str = "Hamlet says, 'To be or not to be...'";

No

    str = 'bar';
    str = '"Be yourself; everyone else is already taken." -Oscar Wilde';

* Surround operators with a single space on either side.

Yes

    x = 3;
    x = 100 / 10;
    x += 3 + 4;
    x |= y && z;

No

    x=3;
    x = 100/10;
    x += 3+4;
    x |= y&&z;

* Operators with a higher priority than others can exclude surrounding
  whitespace in order to denote precedence.  This is meant to allow for
  improved readability for complex statement. You should always use the same
  amount of whitespace on either side of an operator:

Yes

    x = 2**3 + 5;
    x = 2*y + 3*z;
    x = (a+b) * (a-b);

No

    x = 2** 3 + 5;
    x = y+z;
    x +=1;

## Order of Layout

Layout contract elements in the following order:

1. Pragma statements
2. Import statements
3. Interfaces
4. Libraries
5. Contract

Inside each contract, library or interface, use the following order:

1. Library declarations (`using` statements)
2. Constant variables
3. Type declarations
4. State variables
5. Events
6. Modifiers
7. Functions

## Naming Styles

To avoid confusion, the following names will be used to refer to different
naming styles.

* `b` (single lowercase letter)
* `B` (single uppercase letter)
* `lowercase`
* `lower_case_with_underscores`
* `UPPERCASE`
* `UPPER_CASE_WITH_UNDERSCORES`
* `CapitalizedWords` (or CapWords)
* `mixedCase` (differs from CapitalizedWords by initial lowercase character!)
* `Capitalized_Words_With_Underscores`
* `_underscoreMixedCase` 

.. note:: When using initialisms in CapWords, capitalize all the letters of the initialisms. Thus HTTPServerError is better than HttpServerError. When using initialisms is mixedCase, capitalize all the letters of the initialisms, except keep the first one lower case if it is the beginning of the name. Thus xmlHTTPRequest is better than XMLHTTPRequest.


### Names to Avoid

* `l` - Lowercase letter el
* `O` - Uppercase letter oh
* `I` - Uppercase letter eye

Never use any of these for single letter variable names.  They are often
indistinguishable from the numerals one and zero.


### Contract and Library Names

* Contracts and libraries should be named using the CapWords style. Examples: `SimpleToken`, `SmartBank`, `CertificateHashRepository`, `Player`, `Congress`, `Owned`.
* Contract and library names should also match their filenames. 

As shown in the example below, if the contract name is `Congress` and the library name is `Owned`, then their associated filenames should be `congress.sol` and `owned.sol`.

Yes

    pragma solidity >=0.4.0 <0.6.0;
    
    // Owned.sol
    contract Owned {
      address public owner;
    
      constructor() public {
        owner = msg.sender;
      }
    
      modifier onlyOwner {
        require(msg.sender == owner);
        _;
      }
    
      function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
      }
    }
    
    // Congress.sol
    import "./Owned.sol";
    
    contract Congress is Owned, TokenRecipient {
      //...
    }

No

    pragma solidity >=0.4.0 <0.6.0;
    
    // owned.sol
    contract owned {
      address public owner;
    
      constructor() public {
        owner = msg.sender;
      }
    
      modifier onlyOwner {
        require(msg.sender == owner);
        _;
      }
    
      function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
      }
    }
    
    // Congress.sol
    import "./owned.sol";
    
    contract Congress is owned, tokenRecipient {
      //...
    }


### Struct Names

Structs should be named using the CapWords style. Examples: `MyCoin`, `Position`, `PositionXY`.


### Event Names

Events should be named using the CapWords style. Examples: `Deposit`, `Transfer`, `Approval`, `BeforeTransfer`, `AfterTransfer`.


### Function Names

Functions other than constructors should use mixedCase. Examples: `getBalance`, `transfer`, `verifyOwner`, `addMember`, `changeOwner`.
If a function is `private` or `internal` function shoud use _underscoreMixedCase. Examples: `_calculateBalance` , `_doTransfer`. 


### Function Argument Names

Function arguments should use _underscoreMixedCase. Examples: `_initialSupply`, `_account`, `_recipientAddress`, `_senderAddress`, `_newOwner`.

When writing library functions that operate on a custom struct, the struct
should be the first argument and should always be named `self`.


### Local and State Variable Names

Use mixedCase. Examples: `totalSupply`, `remainingSupply`, `balancesOf`, `creatorAddress`, `isPreSale`, `tokenExchangeRate`.


### Constants

Constants should be named with all capital letters with underscores separating
words. Examples: `MAX_BLOCKS`, `TOKEN_NAME`, `TOKEN_TICKER`, `CONTRACT_VERSION`.


### Modifier Names

Use mixedCase. Examples: `onlyBy`, `onlyAfter`, `onlyDuringThePreSale`.


### Enums

Enums, in the style of simple type declarations, should be named using the CapWords style. Examples: `TokenGroup`, `Frame`, `HashStyle`, `CharacterLocation`.
