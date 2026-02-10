export interface Question {
  id: number;
  section: string;
  question: string;
  code?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  studyTip?: string;
  bobExample?: string;
}

export interface Phase {
  id: number;
  name: string;
  sections: string[];
}

export const phases: Phase[] = [
  { id: 1, name: 'DSA & Design Patterns', sections: ['A', 'B', 'C', 'D'] },
  { id: 2, name: 'Platform', sections: ['E'] },
];

export const sections = [
  { id: 'A', name: 'Time & Space Complexity', phase: 1, questions: [1, 10] },
  { id: 'B', name: 'Data Structures', phase: 1, questions: [11, 25] },
  { id: 'C', name: 'Algorithms', phase: 1, questions: [26, 40] },
  { id: 'D', name: 'Design Patterns', phase: 1, questions: [41, 55] },
  { id: 'E', name: 'System Design & Architecture', phase: 2, questions: [56, 65] },
];

export const getPhaseForSection = (sectionId: string): Phase | undefined => {
  const section = sections.find(s => s.id === sectionId);
  return section ? phases.find(p => p.id === section.phase) : undefined;
};

export const questions: Question[] = [
  // Section A: Time & Space Complexity (Questions 1-10)
  {
    id: 1,
    section: 'A',
    question: 'What is the time complexity of accessing an element by index in an array?',
    options: {
      A: 'O(n)',
      B: 'O(log n)',
      C: 'O(1)',
      D: 'O(n log n)',
    },
    correctAnswer: 'C',
    explanation: 'Array access by index is O(1) - direct memory address calculation. No matter how big the input, accessing arr[5] is instant because arrays store elements in contiguous memory locations.',
    studyTip: 'O(1) is the "holy grail" of complexity - the operation takes the same time regardless of input size.',
    bobExample: 'Bob has a filing cabinet with labeled drawers. Whether he has 10 files or 10 million files, finding "Customer #4523" takes the same time — he just opens drawer #4523. The number of files doesn\'t matter because he knows exactly where to look.',
  },
  {
    id: 2,
    section: 'A',
    question: 'What is the time complexity of the following code?',
    code: `def find_sum(arr):
    total = 0
    for num in arr:
        total += num
    return total`,
    options: {
      A: 'O(1)',
      B: 'O(n)',
      C: 'O(n²)',
      D: 'O(log n)',
    },
    correctAnswer: 'B',
    explanation: 'Single loop through n elements = O(n). The loop iterates once for each element in the array, so the time grows linearly with input size.',
    studyTip: 'A single loop over n elements is O(n). Double the input = double the time.',
    bobExample: 'Bob needs to count all the apples in a basket. If there are 50 apples, he counts 50. If there are 500 apples, he counts 500. There\'s no shortcut — he has to look at each apple once. That\'s O(n).',
  },
  {
    id: 3,
    section: 'A',
    question: 'What is the time complexity of the following code?',
    code: `def check_pairs(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            if arr[i] + arr[j] == 10:
                return True
    return False`,
    options: {
      A: 'O(n)',
      B: 'O(n log n)',
      C: 'O(n²)',
      D: 'O(2ⁿ)',
    },
    correctAnswer: 'C',
    explanation: 'Two nested loops, each iterating n times = O(n × n) = O(n²). For each element, we check every other element.',
    studyTip: 'Nested loops over the same data typically indicate O(n²). With 10,000 items, that\'s 100 million operations!',
    bobExample: 'Bob wants to introduce everyone at a party to everyone else. With 10 people, that\'s 45 handshakes. With 100 people, that\'s 4,950 handshakes. With 1,000 people, that\'s 499,500 handshakes. The work explodes because everyone meets everyone — that\'s O(n²).',
  },
  {
    id: 4,
    section: 'A',
    question: 'Binary search has a time complexity of O(log n). If an array has 1,000,000 elements, approximately how many comparisons are needed in the worst case?',
    options: {
      A: '10',
      B: '20',
      C: '100',
      D: '1000',
    },
    correctAnswer: 'B',
    explanation: 'log₂(1,000,000) ≈ 20. Each comparison halves the search space. Binary search is incredibly efficient - to find an item in 1 billion sorted elements, you need only ~30 comparisons.',
    studyTip: 'Remember: 2¹⁰ ≈ 1,000 and 2²⁰ ≈ 1,000,000. This helps estimate log n quickly.',
    bobExample: 'Bob is looking for a name in a phone book with 1,000 pages. He opens to the middle (page 500). "Too far!" He opens to page 250. "Still too far!" Page 125... In just 10 flips, he finds any name. Even with a million pages, he\'d need only 20 flips. That\'s the magic of halving!',
  },
  {
    id: 5,
    section: 'A',
    question: 'What is the space complexity of the following code?',
    code: `def reverse_array(arr):
    result = []
    for i in range(len(arr) - 1, -1, -1):
        result.append(arr[i])
    return result`,
    options: {
      A: 'O(1)',
      B: 'O(log n)',
      C: 'O(n)',
      D: 'O(n²)',
    },
    correctAnswer: 'C',
    explanation: 'Creating a new array of size n requires O(n) space. The function creates a new list that holds all n elements from the original array.',
    studyTip: 'Space complexity measures ADDITIONAL memory. Creating a new structure proportional to input size is O(n) space.',
    bobExample: 'Bob needs to reverse a line of 100 people. He gets 100 new chairs, seats everyone in reverse order, then removes the original chairs. That uses O(n) extra space — he needed 100 extra chairs! If he swapped in place, he\'d only need O(1) space.',
  },
  {
    id: 6,
    section: 'A',
    question: 'What is the time complexity of finding an element in a hash map (dictionary) on average?',
    options: {
      A: 'O(n)',
      B: 'O(log n)',
      C: 'O(1)',
      D: 'O(n log n)',
    },
    correctAnswer: 'C',
    explanation: 'Hash maps provide O(1) average-case lookup via hash function. The hash function converts the key directly to an array index, making lookup instant.',
    studyTip: 'Hash maps are the "magic tool" for turning O(n) searches into O(1). Use them when you need fast lookups!',
    bobExample: 'Bob runs a coat check. Old way: coats on a rack, numbered 1, 2, 3... To find someone\'s coat, he might check 100 coats. New way: Bob assigns each coat a hook based on the owner\'s phone number. When they return, Bob instantly calculates which hook from their phone number. That\'s hashing — O(1) lookup!',
  },
  {
    id: 7,
    section: 'A',
    question: 'What is the time complexity of the best comparison-based sorting algorithms?',
    options: {
      A: 'O(n)',
      B: 'O(n log n)',
      C: 'O(n²)',
      D: 'O(log n)',
    },
    correctAnswer: 'B',
    explanation: 'Comparison-based sorts cannot be faster than O(n log n). This is a proven lower bound. Merge sort and quicksort (average case) achieve this optimal bound.',
    studyTip: 'O(n log n) is the theoretical limit for comparison-based sorting. Non-comparison sorts like counting sort can be O(n) but have restrictions.',
    bobExample: 'Bob needs to sort a deck of 1,000 cards. He divides the deck in half, sorts each half, then merges them. Each "level" of division takes n work, and there are log n levels. That\'s merge sort — O(n log n), and it\'s the fastest general-purpose sorting method.',
  },
  {
    id: 8,
    section: 'A',
    question: 'What is the time complexity of the following code?',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    options: {
      A: 'O(n)',
      B: 'O(log n)',
      C: 'O(n log n)',
      D: 'O(1)',
    },
    correctAnswer: 'B',
    explanation: 'Binary search halves the search space each iteration = O(log n). Each step eliminates half of the remaining elements.',
    studyTip: 'Any algorithm that halves the problem size each step is O(log n). This includes binary search and operations on balanced trees.',
    bobExample: 'Bob is playing a guessing game. His friend picked a number between 1 and 100. Bob guesses 50. "Too high!" Bob guesses 25. "Too low!" Bob guesses 37... Each guess eliminates HALF the remaining possibilities. That\'s O(log n) — powerful!',
  },
  {
    id: 9,
    section: 'A',
    question: 'Which of the following represents the WORST time complexity?',
    options: {
      A: 'O(n log n)',
      B: 'O(n²)',
      C: 'O(2ⁿ)',
      D: 'O(n³)',
    },
    correctAnswer: 'C',
    explanation: 'O(2ⁿ) grows exponentially, much faster than polynomial complexities. For n=30, O(2ⁿ) is about 1 billion, while O(n³) is only 27,000.',
    studyTip: 'Complexity ranking (worst to best): O(2ⁿ) > O(n³) > O(n²) > O(n log n) > O(n) > O(log n) > O(1)',
    bobExample: 'Bob is trying every possible combination of toppings for a pizza. With 3 toppings, there are 8 combinations. With 10 toppings, there are 1,024. With 30 toppings, there are over 1 billion. This is why "brute force" approaches fail on large inputs — O(2ⁿ) explodes!',
  },
  {
    id: 10,
    section: 'A',
    question: 'What is the space complexity of a recursive function that makes n recursive calls with no additional data structures?',
    options: {
      A: 'O(1)',
      B: 'O(log n)',
      C: 'O(n)',
      D: 'O(n²)',
    },
    correctAnswer: 'C',
    explanation: 'Each recursive call adds a frame to the call stack = O(n) space. Even without explicit data structures, recursion uses stack space.',
    studyTip: 'Don\'t forget recursion uses stack space! Each call frame stays on the stack until the function returns.',
    bobExample: 'Bob asks Alice a question. Alice asks Bob Jr. Bob Jr asks Carol... with 100 people in the chain. Each person has to remember who asked them (that\'s a stack frame). When Carol finally answers, the answer bubbles back up through all 100 people. That\'s O(n) space from recursion!',
  },

  // Section B: Data Structures (Questions 11-25)
  {
    id: 11,
    section: 'B',
    question: 'You need to frequently check if an element exists in a collection. Which data structure provides the best average-case performance?',
    options: {
      A: 'Array',
      B: 'Linked List',
      C: 'Hash Set',
      D: 'Binary Search Tree',
    },
    correctAnswer: 'C',
    explanation: 'Hash Set provides O(1) average-case lookup for existence checks. Arrays and linked lists require O(n), and BSTs require O(log n).',
    studyTip: 'Use a Set when you only need to check existence. It\'s slightly more memory-efficient than a dict/HashMap.',
    bobExample: 'Bob is checking tickets at a concert. He doesn\'t care which seat each ticket is for — he just needs to know if a ticket has been used. He keeps a bucket of used ticket stubs. For each person, he checks: "Is this ticket in the bucket?" That\'s a set — O(1) existence check!',
  },
  {
    id: 12,
    section: 'B',
    question: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
    options: {
      A: 'Queue',
      B: 'Stack',
      C: 'Heap',
      D: 'Linked List',
    },
    correctAnswer: 'B',
    explanation: 'Stack follows LIFO - the last element added is the first one removed. Think of a stack of plates - you add and remove from the top.',
    studyTip: 'LIFO = Stack (like plates). FIFO = Queue (like a line at a store).',
    bobExample: 'Bob is washing dishes. He stacks clean plates on top of each other. When someone needs a plate, they take the top one (the last one Bob put there). Bob can only add to the top and remove from the top. That\'s LIFO: Last In, First Out.',
  },
  {
    id: 13,
    section: 'B',
    question: 'You need to process items in the order they arrive (First-In-First-Out). Which data structure should you use?',
    options: {
      A: 'Stack',
      B: 'Queue',
      C: 'Heap',
      D: 'Hash Map',
    },
    correctAnswer: 'B',
    explanation: 'Queue follows FIFO - the first element added is the first one removed. Perfect for processing tasks in arrival order.',
    studyTip: 'Queues are used for BFS traversal, task scheduling, and buffering. Use collections.deque in Python for O(1) operations on both ends.',
    bobExample: 'Bob runs a deli counter. Customers take a number when they arrive and wait in order. Customer #1 is served first, then #2, then #3. Even if #3 arrived just as #1 was finishing, #2 still goes next. That\'s FIFO: First In, First Out. No cutting in line!',
  },
  {
    id: 14,
    section: 'B',
    question: "Which data structure is most appropriate for implementing an 'undo' feature in a text editor?",
    options: {
      A: 'Queue',
      B: 'Stack',
      C: 'Heap',
      D: 'Array',
    },
    correctAnswer: 'B',
    explanation: 'Stack allows pushing actions and popping to undo the most recent one. The last action performed should be the first one undone - perfect LIFO behavior.',
    studyTip: 'Stacks are great for: undo/redo, bracket matching, DFS traversal, and tracking "most recent" state.',
    bobExample: 'Bob is editing a document. He types "Hello", then "World", then deletes "World". When he hits Undo, he wants to restore "World" (the most recent action). Then Undo again restores before "Hello". A stack tracks actions in order, and undo pops the most recent!',
  },
  {
    id: 15,
    section: 'B',
    question: 'You need to repeatedly find and remove the minimum element from a collection. Which data structure is most efficient?',
    options: {
      A: 'Sorted Array',
      B: 'Hash Set',
      C: 'Min-Heap',
      D: 'Linked List',
    },
    correctAnswer: 'C',
    explanation: 'Min-Heap provides O(log n) removal of minimum, O(1) to find it. A sorted array has O(n) insertion. Hash sets don\'t support min efficiently.',
    studyTip: 'Use heaps when you need to repeatedly get the min/max. In Python, use heapq (min-heap by default).',
    bobExample: 'Bob has a pile of job applications on his desk. He always wants to work on the most urgent one first (based on deadline). When he adds a new application or finishes one, the pile magically reshuffles so the most urgent is always on top. That\'s a heap: O(1) to see the top, O(log n) to add or remove.',
  },
  {
    id: 16,
    section: 'B',
    question: 'You need to store a list of tasks and frequently look up whether a specific task ID exists, but you also need to maintain the order in which tasks were added. Which data structure combination is most appropriate?',
    options: {
      A: 'Array only',
      B: 'Hash set only',
      C: 'Hash map + array (or ordered dict)',
      D: 'Stack only',
    },
    correctAnswer: 'C',
    explanation: 'An array alone gives O(n) lookup. A hash set gives O(1) lookup but loses insertion order. Combining a hash map with an array (or using an ordered dict like Python\'s dict) gives both O(1) lookup and preserved insertion order.',
    studyTip: 'Real-world problems often need multiple properties — fast lookup AND ordering. Think about what each data structure gives you and what it lacks.',
    bobExample: 'Bob manages a to-do list. He needs to quickly check "Is task #472 on the list?" (hash map: O(1)) AND display tasks in the order they were added (array preserves order). A hash set alone loses the order. An array alone is slow to search. Bob uses both together!',
  },
  {
    id: 17,
    section: 'B',
    question: 'Which data structure would be best for checking if a string of parentheses like "((()))" is balanced — meaning every opening "(" has a matching closing ")" in the correct order?',
    options: {
      A: 'Queue',
      B: 'Stack',
      C: 'Heap',
      D: 'Hash Map',
    },
    correctAnswer: 'B',
    explanation: 'Stack matches opening brackets with closing brackets in LIFO order. When you see a closing bracket, check if it matches the most recent opening bracket.',
    studyTip: 'The bracket matching problem is a classic stack application. Push opening brackets, pop and compare for closing brackets.',
    bobExample: 'Bob is checking if parentheses are balanced: "((()))" is good, "(()" is bad. He uses a stack of plates. For each \'(\', he adds a red plate. For each \')\', he removes a plate. If he tries to remove but there\'s no plate — unbalanced! If plates remain at the end — also unbalanced!',
  },
  {
    id: 18,
    section: 'B',
    question: 'You need to find the k largest elements from a stream of n elements (where n >> k). What is the most efficient approach?',
    options: {
      A: 'Sort the entire stream',
      B: 'Use a max-heap of size n',
      C: 'Use a min-heap of size k',
      D: 'Use a hash map',
    },
    correctAnswer: 'C',
    explanation: 'Min-heap of size k keeps the k largest elements; the smallest of those stays at the top and gets replaced when a larger element arrives. O(n log k) total.',
    studyTip: 'For k largest: use min-heap of size k. For k smallest: use max-heap of size k. This seems counterintuitive but ensures efficient replacement.',
    bobExample: 'Bob needs to find the 3 heaviest packages from 1,000 boxes, but he can only keep 3 boxes on his tiny desk. He keeps the 3 heaviest he\'s seen so far. When a new box comes, if it\'s heavier than his lightest desk box, he swaps them. His desk is a min-heap of size 3!',
  },
  {
    id: 19,
    section: 'B',
    question: 'Which data structure is most suitable for implementing a graph using adjacency representation?',
    options: {
      A: 'Array of arrays',
      B: 'Hash map of lists',
      C: 'Single linked list',
      D: 'Both A and B are suitable',
    },
    correctAnswer: 'D',
    explanation: 'Both array of arrays and hash map of lists work for adjacency lists. Arrays are faster when node IDs are consecutive integers; hash maps work for any node type.',
    studyTip: 'Adjacency list: efficient for sparse graphs. Adjacency matrix: efficient for dense graphs or when you need O(1) edge existence check.',
    bobExample: 'Bob maps friendships in a social network. For each person, he keeps a list of their friends. He could use an array (if people are numbered 1, 2, 3...) or a hash map (if people have names). Either works — it\'s an adjacency list!',
  },
  {
    id: 20,
    section: 'B',
    question: 'What is the time complexity of inserting an element in the middle of a linked list, assuming you already have a reference to the node before the insertion point?',
    options: {
      A: 'O(n)',
      B: 'O(log n)',
      C: 'O(1)',
      D: 'O(n²)',
    },
    correctAnswer: 'C',
    explanation: 'With a reference to the previous node, insertion is just pointer manipulation = O(1). You just need to update a few next/prev pointers.',
    studyTip: 'Linked list advantage: O(1) insertion/deletion when you have a reference. Disadvantage: O(n) access by index (no random access).',
    bobExample: 'Bob has a conga line of people holding hands. If he\'s standing next to the spot where someone needs to join, adding them is instant — just break one handhold and form two new ones. O(1)! But finding that spot first might take O(n) walking down the line.',
  },

  {
    id: 21,
    section: 'B',
    question: 'What data structure does the following class implement?',
    code: `class MyStructure:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0`,
    options: {
      A: 'Queue',
      B: 'Stack',
      C: 'Linked List',
      D: 'Heap',
    },
    correctAnswer: 'B',
    explanation: 'The class implements a Stack (LIFO). The push() method adds to the top, pop() removes from the top (Python lists pop from the end by default), and peek() views the top element without removing it.',
    studyTip: 'A Stack supports push (add to top), pop (remove from top), and peek (view top). Python lists work naturally as stacks since append() and pop() are both O(1).',
  },
  {
    id: 22,
    section: 'B',
    question: 'What type of graph representation does this code build?',
    code: `from collections import defaultdict

def build_graph(edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    return graph`,
    options: {
      A: 'Directed adjacency matrix',
      B: 'Undirected adjacency list',
      C: 'Directed adjacency list',
      D: 'Weighted adjacency matrix',
    },
    correctAnswer: 'B',
    explanation: 'The code builds an undirected adjacency list. For each edge (u, v), both graph[u].append(v) and graph[v].append(u) are called, making the relationship bidirectional. Using defaultdict(list) creates a mapping from each node to its list of neighbors.',
    studyTip: 'If the code only adds graph[u].append(v) (one direction), it\'s a directed graph. Adding both directions makes it undirected. defaultdict(list) is the idiomatic Python way to build adjacency lists.',
  },
  {
    id: 23,
    section: 'B',
    question: 'What data structure behavior does this code demonstrate?',
    code: `from collections import deque

buffer = deque()
buffer.append("task1")
buffer.append("task2")
buffer.append("task3")

first = buffer.popleft()   # "task1"
second = buffer.popleft()  # "task2"`,
    options: {
      A: 'Stack (LIFO)',
      B: 'Queue (FIFO)',
      C: 'Priority Queue',
      D: 'Double-ended Queue used as a Stack',
    },
    correctAnswer: 'B',
    explanation: 'The code demonstrates Queue (FIFO) behavior. Elements are added with append() (to the right end) and removed with popleft() (from the left end). The first item added ("task1") is the first removed — First In, First Out.',
    studyTip: 'collections.deque is Python\'s go-to for queues. append() + popleft() gives FIFO (Queue). append() + pop() gives LIFO (Stack). Both operations are O(1) on a deque.',
  },
  {
    id: 24,
    section: 'B',
    question: 'What key property does this insert function maintain?',
    code: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root`,
    options: {
      A: 'AVL balance property (heights differ by at most 1)',
      B: 'BST property (left < node < right)',
      C: 'Max-heap property (parent >= children)',
      D: 'Red-black tree color property',
    },
    correctAnswer: 'B',
    explanation: 'The function maintains the Binary Search Tree (BST) property: all values in the left subtree are less than the node, and all values in the right subtree are greater than or equal to the node. It recursively places smaller values left and larger values right.',
    studyTip: 'The BST property enables O(log n) search on balanced trees. The key insight is the comparison: val < root.val goes left, otherwise goes right. This is a classic recursive BST insertion.',
  },
  {
    id: 25,
    section: 'B',
    question: 'What is the output of this code?',
    code: `import heapq

data = [5, 3, 8, 1, 2]
heapq.heapify(data)

result = []
for _ in range(3):
    result.append(heapq.heappop(data))
print(result)`,
    options: {
      A: '[5, 3, 8]',
      B: '[8, 5, 3]',
      C: '[1, 2, 3]',
      D: '[3, 2, 1]',
    },
    correctAnswer: 'C',
    explanation: 'heapify() converts the list into a min-heap. heappop() always removes and returns the smallest element. Popping 3 times gives the 3 smallest elements in ascending order: [1, 2, 3].',
    studyTip: 'Python\'s heapq module implements a min-heap. heapify() is O(n), and each heappop() is O(log n). To get a max-heap, negate the values or use nlargest().',
  },

  // Section C: Algorithms (Questions 26-40)
  {
    id: 26,
    section: 'C',
    question: 'Which algorithm is best suited for finding the shortest path in an unweighted graph?',
    options: {
      A: 'Depth-First Search (DFS)',
      B: 'Breadth-First Search (BFS)',
      C: 'Binary Search',
      D: 'Quick Sort',
    },
    correctAnswer: 'B',
    explanation: 'BFS explores level by level, guaranteeing the shortest path in unweighted graphs. The first time you reach a node is via the shortest path.',
    studyTip: 'BFS = shortest path in unweighted graphs. For weighted graphs, use Dijkstra\'s algorithm.',
    bobExample: 'Bob is looking for his lost cat in a neighborhood. His strategy: first check all houses on his street, then all houses one block away, then two blocks away. He explores in "waves" outward. BFS guarantees Bob finds the SHORTEST path to his cat!',
  },
  {
    id: 27,
    section: 'C',
    question: 'What type of problem is Dynamic Programming best suited for?',
    options: {
      A: 'Problems with no overlapping subproblems',
      B: 'Problems with overlapping subproblems and optimal substructure',
      C: 'Problems that require sorting',
      D: 'Problems that only have one solution',
    },
    correctAnswer: 'B',
    explanation: 'DP excels when subproblems overlap (same subproblem solved multiple times) and optimal solutions can be built from optimal sub-solutions.',
    studyTip: 'DP = overlapping subproblems + optimal substructure. If you see exponential recursion with repeated work, consider DP.',
    bobExample: 'Bob is climbing stairs and can take 1 or 2 steps at a time. How many ways to climb 5 stairs? He realizes: ways to reach step 5 = ways to reach step 4 + ways to reach step 3. But he keeps recalculating! So Bob writes down answers: ways[1]=1, ways[2]=2... That\'s DP: remember solutions!',
  },
  {
    id: 28,
    section: 'C',
    question: 'Which traversal order visits the left subtree, then the root, then the right subtree?',
    options: {
      A: 'Preorder',
      B: 'Inorder',
      C: 'Postorder',
      D: 'Level order',
    },
    correctAnswer: 'B',
    explanation: 'Inorder: Left → Root → Right. For a Binary Search Tree, this gives elements in sorted order!',
    studyTip: 'Preorder (Root-Left-Right): copy tree. Inorder (Left-Root-Right): sorted order for BST. Postorder (Left-Right-Root): delete tree.',
    bobExample: 'Bob is reading a family tree. Inorder means: visit all ancestors on the left, then the current person, then all ancestors on the right. For a BST, this gives everyone in alphabetical/sorted order!',
  },
  {
    id: 29,
    section: 'C',
    question: 'What is the key requirement for using binary search?',
    options: {
      A: 'Data must be stored in a linked list',
      B: 'Data must be sorted',
      C: 'Data must be unique',
      D: 'Data must be integers',
    },
    correctAnswer: 'B',
    explanation: 'Binary search requires sorted data to eliminate half the search space. Without ordering, you can\'t decide which half to search.',
    studyTip: 'Binary search works on any sorted, indexable collection. It can find not just exact matches but also boundaries (first/last occurrence).',
    bobExample: 'Bob is playing a guessing game, but the numbers are scrambled (not in order). "Is it 50?" "Higher!" But wait — 50 could be anywhere! Without sorted order, Bob can\'t eliminate anything. Binary search ONLY works on sorted data.',
  },
  {
    id: 30,
    section: 'C',
    question: 'Which approach does DFS use for traversal?',
    options: {
      A: 'Queue (FIFO)',
      B: 'Stack (LIFO) or recursion',
      C: 'Heap',
      D: 'Hash Map',
    },
    correctAnswer: 'B',
    explanation: 'DFS uses a stack (explicit or via recursion) to go deep before backtracking. The call stack naturally provides LIFO behavior.',
    studyTip: 'DFS = Stack/Recursion, goes deep. BFS = Queue, explores level by level. Both are O(V+E) for graphs.',
    bobExample: 'Bob is exploring a maze. His strategy: always turn right until you hit a dead end, then backtrack to the last intersection and try a different path. He goes as DEEP as possible before backtracking. That\'s DFS — and it naturally uses a stack (or recursion) to remember where to backtrack!',
  },
  {
    id: 31,
    section: 'C',
    question: 'The Two-Pointer technique is most commonly used for:',
    options: {
      A: 'Sorting algorithms',
      B: 'Problems involving sorted arrays or finding pairs',
      C: 'Tree traversals',
      D: 'Graph algorithms',
    },
    correctAnswer: 'B',
    explanation: 'Two pointers efficiently solve problems with sorted arrays or finding pairs. They move toward or away from each other based on conditions.',
    studyTip: 'Two-pointer patterns: one from each end (two sum), slow/fast (cycle detection), or same direction (sliding window variant).',
    bobExample: 'Bob has a sorted row of jars with different amounts of candies. He needs to find two jars that together have exactly 100 candies. Instead of checking every pair, he puts one finger on the smallest jar and one on the largest. If the sum is too big, move right finger left. Too small, move left finger right. One pass!',
  },
  {
    id: 32,
    section: 'C',
    question: 'What is the main difference between memoization and tabulation in Dynamic Programming?',
    options: {
      A: 'Memoization is top-down, tabulation is bottom-up',
      B: 'Tabulation is top-down, memoization is bottom-up',
      C: 'Memoization uses more space',
      D: 'Tabulation is always faster',
    },
    correctAnswer: 'A',
    explanation: 'Memoization starts from the problem (top-down) and caches results. Tabulation builds from base cases (bottom-up) filling a table.',
    studyTip: 'Memoization: recursive + cache, easier to implement. Tabulation: iterative + table, often more space-efficient and avoids stack overflow.',
    bobExample: 'Bob calculating Fibonacci. Memoization: "What\'s fib(5)? I need fib(4) and fib(3)..." — starts from the answer and works down, caching along the way. Tabulation: "fib(1)=1, fib(2)=1, fib(3)=2..." — builds from the bottom up, filling a table.',
  },
  {
    id: 33,
    section: 'C',
    question: 'Which algorithm pattern is used to find all possible combinations or permutations?',
    options: {
      A: 'Sliding Window',
      B: 'Two Pointers',
      C: 'Backtracking',
      D: 'Binary Search',
    },
    correctAnswer: 'C',
    explanation: 'Backtracking explores all possibilities by making choices, recursing, then undoing choices (backtracking) to try alternatives.',
    studyTip: 'Backtracking template: make a choice → recurse → undo the choice. Used for permutations, combinations, N-queens, sudoku.',
    bobExample: 'Bob is solving a maze. He tries one path. Dead end! He backtracks to the last intersection and tries another path. Backtracking is "try, fail, undo, try again" — it explores ALL possibilities by making choices and undoing them.',
  },
  {
    id: 34,
    section: 'C',
    question: 'The Sliding Window technique is best used for:',
    options: {
      A: 'Finding pairs in sorted arrays',
      B: 'Problems involving contiguous subarrays or substrings',
      C: 'Tree traversals',
      D: 'Finding shortest paths',
    },
    correctAnswer: 'B',
    explanation: 'Sliding window maintains a "window" over contiguous elements efficiently. Perfect for substring/subarray problems with some constraint.',
    studyTip: 'Sliding window: add element on right, remove from left. Great for "longest substring with K distinct chars" type problems.',
    bobExample: 'Bob is a health inspector checking restaurants on a street. He needs to find which 5 consecutive restaurants have the most health violations combined. Instead of re-counting all 5 each time he moves, he keeps a running total: subtract the restaurant leaving the window, add the restaurant entering. One pass!',
  },
  {
    id: 35,
    section: 'C',
    question: "What is the time complexity of detecting a cycle in a linked list using Floyd's algorithm (fast and slow pointers)?",
    options: {
      A: 'O(n²)',
      B: 'O(n log n)',
      C: 'O(n)',
      D: 'O(1)',
    },
    correctAnswer: 'C',
    explanation: "Floyd's algorithm visits each node at most twice = O(n) time. The fast pointer catches up to slow within one cycle if there is one.",
    studyTip: "Floyd's tortoise and hare: O(n) time, O(1) space for cycle detection. Can also find cycle start with additional pointer reset.",
    bobExample: 'Bob and his fast friend are running on a track. If the track is a loop, the fast friend will eventually lap Bob (they\'ll meet). If it\'s not a loop, the fast friend reaches the end. This is Floyd\'s algorithm: slow pointer moves 1 step, fast moves 2. If they meet, there\'s a cycle!',
  },

  {
    id: 36,
    section: 'C',
    question: 'Which sorting algorithm does this code implement?',
    code: `def mystery_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = mystery_sort(arr[:mid])
    right = mystery_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    options: {
      A: 'Quick Sort',
      B: 'Merge Sort',
      C: 'Heap Sort',
      D: 'Insertion Sort',
    },
    correctAnswer: 'B',
    explanation: 'This is Merge Sort. The key characteristics are: dividing the array at the midpoint (not using a pivot), recursively sorting both halves, and merging two sorted halves back together. Merge Sort is O(n log n) in all cases.',
    studyTip: 'Merge Sort: split in half, sort each, merge. Quick Sort: pick pivot, partition, sort each side. Merge Sort guarantees O(n log n) but uses O(n) extra space.',
  },
  {
    id: 37,
    section: 'C',
    question: 'What type of tree traversal does this code perform?',
    code: `from collections import deque

def traverse(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result`,
    options: {
      A: 'Inorder (DFS)',
      B: 'Preorder (DFS)',
      C: 'Postorder (DFS)',
      D: 'Level-order (BFS)',
    },
    correctAnswer: 'D',
    explanation: 'This is level-order (BFS) traversal. The use of a queue (deque with popleft) processes nodes level by level: first the root, then all depth-1 nodes, then depth-2 nodes, and so on. DFS traversals use recursion or a stack instead.',
    studyTip: 'Level-order = BFS on a tree. The queue ensures nodes are visited breadth-first. DFS traversals (inorder, preorder, postorder) use the call stack or an explicit stack.',
  },
  {
    id: 38,
    section: 'C',
    question: 'Which Dynamic Programming technique does this Fibonacci implementation use?',
    code: `def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]`,
    options: {
      A: 'Tabulation (bottom-up DP)',
      B: 'Memoization (top-down DP)',
      C: 'Greedy approach',
      D: 'Divide and conquer without DP',
    },
    correctAnswer: 'B',
    explanation: 'This uses Memoization (top-down DP). The function starts from the desired value (top) and recursively breaks it into subproblems, caching results in the memo dictionary to avoid redundant calculations. Without memoization, this would be O(2^n); with it, it\'s O(n).',
    studyTip: 'Memoization = recursion + cache (top-down). Tabulation = iterative loop filling a table (bottom-up). Both achieve the same O(n) complexity for Fibonacci but approach the problem differently.',
  },
  {
    id: 39,
    section: 'C',
    question: 'What does this function return when called with the given arguments?',
    code: `def search(arr, target):
    left, right = 0, len(arr) - 1
    steps = 0
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if arr[mid] == target:
            return (mid, steps)
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return (-1, steps)

result = search([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)
print(result)`,
    options: {
      A: '(5, 2)',
      B: '(5, 3)',
      C: '(23, 5)',
      D: '(4, 3)',
    },
    correctAnswer: 'B',
    explanation: 'Binary search for 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]: Step 1: mid=4, arr[4]=16 < 23, go right. Step 2: mid=7, arr[7]=56 > 23, go left. Step 3: mid=5, arr[5]=23 = target, found! Returns (index=5, steps=3).',
    studyTip: 'To trace binary search: track left, right, and mid at each step. The search space halves each time. For 10 elements, worst case is about 4 steps (log2 10).',
  },
  {
    id: 40,
    section: 'C',
    question: 'Which algorithmic technique does this function use?',
    code: `def max_sum_subarray(arr, k):
    if len(arr) < k:
        return None
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
    options: {
      A: 'Two Pointers',
      B: 'Divide and Conquer',
      C: 'Sliding Window',
      D: 'Dynamic Programming',
    },
    correctAnswer: 'C',
    explanation: 'This is the Sliding Window technique. The function maintains a fixed-size window of k elements, sliding it one position at a time by adding the new right element and subtracting the old left element. This finds the maximum sum subarray of size k in O(n) time instead of the naive O(n*k).',
    studyTip: 'The Sliding Window technique is identified by: maintaining a window (fixed or variable size), adding new elements on one side, and removing from the other. It converts O(n*k) brute force into O(n).',
  },

  // Section D: Design Patterns (Questions 41-55)
  {
    id: 41,
    section: 'D',
    question: 'Which design pattern ensures that a class has only one instance and provides a global point of access to it?',
    options: {
      A: 'Factory',
      B: 'Singleton',
      C: 'Observer',
      D: 'Strategy',
    },
    correctAnswer: 'B',
    explanation: 'Singleton ensures exactly one instance with global access. Useful for shared resources like database connections, configuration managers, or logging.',
    studyTip: 'Singleton is simple but use sparingly - it can make testing harder. Consider dependency injection as an alternative.',
    bobExample: 'Bob\'s office has ONE printer shared by everyone. It would be chaos if every employee could create their own printer instance — they\'d fight over settings, jobs would conflict. Instead, there\'s a single printer that everyone accesses. That\'s Singleton: one instance, globally accessible.',
  },
  {
    id: 42,
    section: 'D',
    question: 'You need to create different types of database connections (MySQL, PostgreSQL, MongoDB) based on configuration. Which pattern is most appropriate?',
    options: {
      A: 'Singleton',
      B: 'Factory',
      C: 'Observer',
      D: 'Builder',
    },
    correctAnswer: 'B',
    explanation: 'Factory creates objects based on type without exposing creation logic. The client code doesn\'t need to know which concrete class is instantiated.',
    studyTip: 'Factory: "what type of object?" Strategy: "what behavior?" Builder: "how to construct complex object?"',
    bobExample: 'Bob runs a vehicle rental shop. Customers say "I need transportation" and Bob figures out whether to give them a car, motorcycle, or bicycle based on their needs. The customer doesn\'t need to know HOW to create a car — they just ask Bob\'s factory.',
  },
  {
    id: 43,
    section: 'D',
    question: "Which design pattern allows you to change an object's behavior at runtime by swapping its algorithm?",
    options: {
      A: 'Factory',
      B: 'Singleton',
      C: 'Strategy',
      D: 'Observer',
    },
    correctAnswer: 'C',
    explanation: 'Strategy defines interchangeable algorithms that can be swapped at runtime. The object delegates to a strategy and can change which strategy it uses.',
    studyTip: 'Strategy uses composition: the context HAS a strategy. Factory creates objects; Strategy changes behavior of existing objects.',
    bobExample: 'Bob\'s restaurant calculates bills differently for different customers. Regular customers pay full price. Members get 10% off. VIP members get 20% off. Instead of giant if-else statements, Bob creates separate "pricing calculators" and swaps them based on customer type. That\'s Strategy!',
  },
  {
    id: 44,
    section: 'D',
    question: "You're building a notification system where multiple services (email, SMS, push) need to react when a new order is placed. Which pattern fits best?",
    options: {
      A: 'Factory',
      B: 'Singleton',
      C: 'Strategy',
      D: 'Observer',
    },
    correctAnswer: 'D',
    explanation: 'Observer notifies multiple dependents when state changes (one-to-many). Each notification service subscribes and reacts independently.',
    studyTip: 'Observer pattern = Publisher/Subscriber = Event-driven architecture. Great for decoupling components that react to changes.',
    bobExample: 'Bob publishes a newsletter. Subscribers sign up and get notified whenever Bob publishes something new. Bob doesn\'t know who his subscribers are or what they do with the newsletter — some read it, some archive it, some share it. He just broadcasts, and everyone who signed up reacts. That\'s Observer!',
  },
  {
    id: 45,
    section: 'D',
    question: 'Which design pattern is best for constructing complex objects with many optional parameters?',
    options: {
      A: 'Factory',
      B: 'Builder',
      C: 'Singleton',
      D: 'Observer',
    },
    correctAnswer: 'B',
    explanation: 'Builder constructs complex objects step by step with optional parameters. It provides readable, chainable construction.',
    studyTip: 'Builder shines when constructors would have many parameters. Common example: HTTP request builders, query builders.',
    bobExample: 'Bob orders a custom sandwich. Instead of a form with 20 fields (bread type, cheese, meat, veggies, sauce, toasted?...), he tells the sandwich artist step by step: "Start with wheat bread. Add turkey. Add swiss cheese. Toast it. Done!" That\'s Builder — step-by-step construction.',
  },
  {
    id: 46,
    section: 'D',
    question: 'In the Strategy pattern, what is the relationship between the context and the strategy?',
    options: {
      A: 'The context creates the strategy',
      B: 'The context inherits from the strategy',
      C: 'The context holds a reference to a strategy and delegates to it',
      D: 'The strategy creates the context',
    },
    correctAnswer: 'C',
    explanation: 'Context holds a strategy reference and delegates the algorithm to it. This is composition over inheritance - the strategy can be changed at runtime.',
    studyTip: 'Strategy uses composition: context.setStrategy(new ConcreteStrategy()). The context doesn\'t know which concrete strategy it\'s using.',
    bobExample: 'Bob\'s restaurant (the context) has a pricing calculator slot. He can plug in RegularPricing, MemberPricing, or VIPPricing (strategies). The restaurant doesn\'t know HOW prices are calculated — it just asks whatever strategy is plugged in. Swap strategies anytime!',
  },
  {
    id: 47,
    section: 'D',
    question: 'Which pattern would you use to add new functionality to an object dynamically without changing its class?',
    options: {
      A: 'Proxy',
      B: 'Decorator',
      C: 'Strategy',
      D: 'Adapter',
    },
    correctAnswer: 'B',
    explanation: 'Decorator wraps an object to add behavior without modifying its class. You can stack decorators for multiple behaviors.',
    studyTip: 'Decorator wraps the original and adds behavior. Example: LoggingDecorator(CachingDecorator(DatabaseConnection()))',
    bobExample: 'Bob has a basic coffee ($2). He wants to add milk (+$0.50) and whipped cream (+$0.75). Instead of creating "CoffeeWithMilkAndWhippedCream" class, he wraps: WhippedCream(Milk(Coffee())). Each wrapper adds its cost. Decorators let you stack functionality!',
  },
  {
    id: 48,
    section: 'D',
    question: 'A configuration manager that loads settings once and is accessed throughout the application is an example of which pattern?',
    options: {
      A: 'Factory',
      B: 'Observer',
      C: 'Singleton',
      D: 'Strategy',
    },
    correctAnswer: 'C',
    explanation: 'Configuration loaded once and accessed globally = Singleton pattern. It ensures consistent configuration across the entire application.',
    studyTip: 'Common Singleton uses: config managers, connection pools, logging services, caches. All need single shared instance.',
    bobExample: 'Bob\'s company has ONE official rulebook. Every department refers to the same rulebook — they don\'t each make their own copy that might drift apart. When HR updates a policy, everyone sees the same update. That\'s Singleton: one instance, shared by all.',
  },
  {
    id: 49,
    section: 'D',
    question: 'Which statement best describes the Factory pattern?',
    options: {
      A: 'It ensures only one instance exists',
      B: 'It creates objects without exposing the instantiation logic to the client',
      C: 'It defines a family of interchangeable algorithms',
      D: 'It allows objects to be notified of changes',
    },
    correctAnswer: 'B',
    explanation: 'Factory creates objects without exposing instantiation logic to clients. Clients ask for a type, and the factory returns the appropriate object.',
    studyTip: 'Factory hides the "new" keyword from clients. The client doesn\'t need to know concrete class names or how to construct them.',
    bobExample: 'Bob\'s pizza shop takes orders: "I want a pepperoni pizza." Bob doesn\'t explain how he makes it — he just returns a finished pizza. The customer (client) doesn\'t know about PepperoniPizza class, dough preparation, or oven temperature. Factory hides the creation complexity.',
  },
  {
    id: 50,
    section: 'D',
    question: 'You have different pricing strategies (regular, member, premium) that can be applied to bookings. Which pattern allows switching between these at runtime?',
    options: {
      A: 'Singleton',
      B: 'Factory',
      C: 'Strategy',
      D: 'Builder',
    },
    correctAnswer: 'C',
    explanation: 'Strategy allows swapping algorithms (pricing rules) at runtime. The booking service can change which pricing strategy it uses based on user type.',
    studyTip: 'At Bobs company, Strategy pattern is used for pricing, discounts, and search ranking algorithms that vary by context.',
    bobExample: 'Bob\'s hotel booking system needs different pricing: regular guests pay rack rate, members get 10% off, VIPs get 20% off plus free breakfast. Instead of if-else chains, Bob plugs in different pricing strategies. When a VIP books, swap to VIPPricingStrategy. Clean and extensible!',
  },
  {
    id: 51,
    section: 'D',
    question: 'Which pattern provides a simplified interface to a complex subsystem of classes?',
    options: {
      A: 'Adapter',
      B: 'Facade',
      C: 'Proxy',
      D: 'Decorator',
    },
    correctAnswer: 'B',
    explanation: 'Facade provides a simple interface to a complex subsystem. It hides the complexity and provides a unified entry point.',
    studyTip: 'Facade simplifies; it doesn\'t add functionality. Think of it as a receptionist who handles complex internal routing.',
    bobExample: 'Bob wants to watch a movie at home. Without a facade, he\'d need to: turn on TV, turn on amplifier, turn on DVD player, set input sources, dim lights... With a "HomeTheaterFacade", Bob just calls watchMovie() and it handles everything. Facade simplifies complex subsystems!',
  },
  {
    id: 52,
    section: 'D',
    question: 'You have a class with an incompatible interface that needs to work with your existing code. Which pattern should you use?',
    options: {
      A: 'Adapter',
      B: 'Facade',
      C: 'Proxy',
      D: 'Decorator',
    },
    correctAnswer: 'A',
    explanation: 'Adapter converts one interface to another. It allows incompatible classes to work together by wrapping one with a compatible interface.',
    studyTip: 'Adapter = interface converter. Facade = simplifier. Adapter makes incompatible things compatible; Facade makes complex things simple.',
    bobExample: 'Bob has a European laptop charger but US outlets. He uses an adapter — it doesn\'t change what the charger does, it just makes it compatible with US outlets. Similarly, an Adapter pattern wraps an incompatible class to make it work with your code.',
  },
  {
    id: 53,
    section: 'D',
    question: 'Which pattern controls access to an object, potentially adding security checks, lazy loading, or logging?',
    options: {
      A: 'Decorator',
      B: 'Facade',
      C: 'Proxy',
      D: 'Adapter',
    },
    correctAnswer: 'C',
    explanation: 'Proxy controls access to an object. It can add security, lazy initialization, logging, or caching while maintaining the same interface.',
    studyTip: 'Proxy controls access (security, caching, lazy loading). Decorator adds behavior. Both wrap objects but for different purposes.',
    bobExample: 'Bob\'s bank has a vault (the real object). You don\'t access the vault directly — you go through a bank teller (proxy) who checks your ID, logs the transaction, and only then opens the vault. Proxy controls access to the real object.',
  },
  {
    id: 54,
    section: 'D',
    question: 'Which pattern defines the skeleton of an algorithm, letting subclasses override specific steps without changing the algorithm\'s structure?',
    options: {
      A: 'Strategy',
      B: 'Template Method',
      C: 'Factory',
      D: 'Observer',
    },
    correctAnswer: 'B',
    explanation: 'Template Method defines algorithm skeleton in a base class, letting subclasses override specific steps. The overall structure remains fixed.',
    studyTip: 'Template Method uses inheritance; Strategy uses composition. Template Method: "here\'s the algorithm, override these steps." Strategy: "here\'s a slot for any algorithm."',
    bobExample: 'Bob\'s coffee shop has a template for making drinks: boil water → brew → pour → add condiments. For tea, "brew" steeps tea leaves. For coffee, "brew" drips through grounds. The template (steps order) is fixed, but subclasses customize specific steps. That\'s Template Method!',
  },
  {
    id: 55,
    section: 'D',
    question: 'You want to add logging to every method call in a service class without modifying the original class. Which pattern combination would work best?',
    options: {
      A: 'Factory + Singleton',
      B: 'Proxy or Decorator',
      C: 'Observer + Strategy',
      D: 'Builder + Template Method',
    },
    correctAnswer: 'B',
    explanation: 'Both Proxy and Decorator can wrap the original class and add logging. Proxy is often used for cross-cutting concerns like logging, security, and caching.',
    studyTip: 'Proxy/Decorator both wrap objects. Proxy typically for access control/logging (cross-cutting). Decorator typically for adding features.',
    bobExample: 'Bob wants every warehouse access logged without changing the warehouse code. He creates a LoggingProxy that wraps the warehouse: every time someone calls getItem(), the proxy logs "User X accessed item Y" then calls the real warehouse. The original class is unchanged!',
  },

  // Section E: System Design & Architecture (Questions 56-65)
  {
    id: 56,
    section: 'E',
    question: 'Which scaling approach involves adding more machines to handle increased load?',
    options: {
      A: 'Vertical scaling',
      B: 'Horizontal scaling',
      C: 'Load balancing',
      D: 'Database replication',
    },
    correctAnswer: 'B',
    explanation: 'Horizontal scaling adds more machines; vertical scaling adds more power to one machine. Horizontal is more complex but virtually unlimited.',
    studyTip: 'Vertical = upgrade the server. Horizontal = add more servers. Web servers scale horizontally easily; databases are harder.',
    bobExample: 'Bob\'s pizza shop is overwhelmed. Vertical scaling: Bob buys a bigger oven (more power, but there\'s a limit). Horizontal scaling: Bob opens more locations. Each has its own oven. Unlimited scaling, but now he needs to coordinate across locations!',
  },
  {
    id: 57,
    section: 'E',
    question: 'What is the primary purpose of a load balancer?',
    options: {
      A: 'To store data across multiple databases',
      B: 'To distribute incoming traffic across multiple servers',
      C: 'To cache frequently accessed data',
      D: 'To encrypt network traffic',
    },
    correctAnswer: 'B',
    explanation: 'Load balancers distribute traffic across servers for scalability and availability. Common algorithms: round-robin, least connections, IP hash.',
    studyTip: 'Load balancer benefits: scalability, availability (failover), SSL termination. Essential for any scaled web application.',
    bobExample: 'Bob\'s call center has 5 operators. Without coordination, all calls might go to operator 1 while others sit idle. A load balancer is like a receptionist who distributes calls: "Operator 1, you take this one. Operator 2, you take the next..."',
  },
  {
    id: 58,
    section: 'E',
    question: 'In the Cache-Aside pattern, what happens on a cache miss?',
    options: {
      A: 'Fetch from database and return without updating the cache',
      B: 'Fetch from database, store in cache, then return',
      C: 'The cache automatically fetches from the database',
      D: 'The request is queued until a background process populates the cache',
    },
    correctAnswer: 'B',
    explanation: 'Cache-Aside: on miss, the application fetches from DB, stores in cache, returns to client. Application controls the caching logic.',
    studyTip: 'Cache-Aside is most common. Alternatives: Read-Through (cache fetches), Write-Through (write to both), Write-Behind (async writes).',
    bobExample: 'Bob runs a library. When someone asks for a book, he checks his desk shelf (cache) first. Not there? He walks to the warehouse (database), gets it, puts a copy on his shelf for next time, and gives it to the customer. That\'s Cache-Aside!',
  },
  {
    id: 59,
    section: 'E',
    question: 'Which caching strategy writes data to the cache and database simultaneously?',
    options: {
      A: 'Cache-Aside',
      B: 'Write-Through',
      C: 'Write-Behind',
      D: 'Read-Through',
    },
    correctAnswer: 'B',
    explanation: 'Write-Through writes to cache and database synchronously. Ensures consistency but has higher write latency.',
    studyTip: 'Write-Through: consistent but slow writes. Write-Behind: fast writes but eventual consistency. Choose based on consistency requirements.',
    bobExample: 'Bob updates his inventory. Write-Through: he updates both his quick-reference notepad (cache) AND the master ledger (database) at the same time. Slower, but both are always in sync. Write-Behind would update notepad first, ledger later.',
  },
  {
    id: 60,
    section: 'E',
    question: 'What is the main advantage of database read replicas?',
    options: {
      A: 'They allow distributing write operations across multiple nodes',
      B: 'They increase read throughput by distributing read queries',
      C: 'They ensure strong consistency across all database nodes',
      D: 'They automatically partition data across multiple servers',
    },
    correctAnswer: 'B',
    explanation: 'Read replicas handle read queries, freeing the primary for writes. Great for read-heavy workloads (most web applications).',
    studyTip: 'Read replicas: scale reads. Sharding: scale writes. Most apps are 90%+ reads, so replicas often suffice.',
    bobExample: 'Bob\'s library is popular. One librarian (primary database) handles all requests. Overwhelmed! So Bob hires assistant librarians (replicas) who maintain copies of the catalog. Customers can ASK any assistant for book info (reads), but only the main librarian can UPDATE the catalog (writes).',
  },
  {
    id: 61,
    section: 'E',
    question: 'Which HTTP status code indicates that the client sent an invalid request?',
    options: {
      A: '200',
      B: '400',
      C: '404',
      D: '500',
    },
    correctAnswer: 'B',
    explanation: '400 Bad Request indicates client error (invalid input, malformed syntax). 4xx = client errors, 5xx = server errors.',
    studyTip: '200=OK, 201=Created, 400=Bad Request, 401=Unauthorized, 403=Forbidden, 404=Not Found, 500=Server Error.',
    bobExample: 'Bob orders at a restaurant. 200: "Here\'s your food!" 400: "Sir, that\'s not a valid menu item" (your fault). 404: "We don\'t have that dish" (doesn\'t exist). 500: "Sorry, kitchen caught fire" (our fault). 400 = client made a bad request.',
  },
  {
    id: 62,
    section: 'E',
    question: 'In RESTful API design, which HTTP method should be used to update an existing resource?',
    options: {
      A: 'GET',
      B: 'POST',
      C: 'PUT or PATCH',
      D: 'DELETE',
    },
    correctAnswer: 'C',
    explanation: 'PUT replaces entire resource; PATCH updates partially. Both are used for updates. POST is for creating, GET for reading.',
    studyTip: 'PUT is idempotent (same result if called multiple times). PATCH may or may not be. POST is not idempotent.',
    bobExample: 'Bob\'s hotel API: GET /rooms/123 = view room. POST /rooms = create room. PUT /rooms/123 = replace all room info. PATCH /rooms/123 = update just the price. DELETE /rooms/123 = remove room. PUT/PATCH are for updates!',
  },
  {
    id: 63,
    section: 'E',
    question: 'What is database sharding?',
    options: {
      A: 'Replicating the entire database across multiple servers for redundancy',
      B: 'Splitting data across multiple databases based on a shard key',
      C: 'Partitioning tables within a single database server for faster queries',
      D: 'Creating read-only copies of the primary database for scaling reads',
    },
    correctAnswer: 'B',
    explanation: 'Sharding splits data across databases using a shard key (e.g., user_id % 4). Enables write scaling but complicates cross-shard queries.',
    studyTip: 'Sharding tradeoffs: enables scale but adds complexity (joins across shards, rebalancing). Consider it only when read replicas aren\'t enough.',
    bobExample: 'Bob\'s library has 1 million books. Too big for one building! Solution: Building A has A-M authors, Building B has N-Z. When someone asks for a book, Bob first determines which building based on author, then asks that building\'s librarian. That\'s sharding!',
  },
  {
    id: 64,
    section: 'E',
    question: 'Which rate limiting algorithm allows controlled bursts of traffic while maintaining an average rate?',
    options: {
      A: 'Fixed Window',
      B: 'Token Bucket',
      C: 'Leaky Bucket',
      D: 'Sliding Window Log',
    },
    correctAnswer: 'B',
    explanation: 'Token Bucket allows bursts while maintaining average rate over time. Tokens accumulate and are consumed per request; burst size = bucket size.',
    studyTip: 'Token Bucket: smooth, allows bursts. Leaky Bucket: strict, constant rate. Fixed Window: simple but has edge-case issues.',
    bobExample: 'Bob\'s bakery can make 100 cookies per hour. Token Bucket: customers get tokens over time; each request costs a token. If you\'ve been saving tokens, you can order a burst. If you\'re out, wait. This allows bursts while enforcing average limits.',
  },
  {
    id: 65,
    section: 'E',
    question: 'What is the main trade-off when using eventual consistency instead of strong consistency?',
    options: {
      A: 'Lower availability for faster reads',
      B: 'Higher latency for guaranteed consistency',
      C: 'Possible stale reads in exchange for higher availability and performance',
      D: 'Increased storage requirements',
    },
    correctAnswer: 'C',
    explanation: 'Eventual consistency may serve stale data but offers better availability/performance. Strong consistency guarantees latest data but can block.',
    studyTip: 'CAP theorem: you can only have 2 of 3 (Consistency, Availability, Partition tolerance). Most distributed systems choose AP with eventual consistency.',
    bobExample: 'Bob\'s chain of stores syncs inventory. Strong consistency: every store waits for confirmation from all others before completing a sale (slow but accurate). Eventual consistency: stores sell immediately and sync later (fast but might oversell briefly). Trade-off: speed vs. accuracy.',
  },
];

export const getSectionName = (sectionId: string): string => {
  const section = sections.find(s => s.id === sectionId);
  return section ? section.name : 'Unknown Section';
};

export const getQuestionsBySection = (sectionId: string): Question[] => {
  return questions.filter(q => q.section === sectionId);
};
