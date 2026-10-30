// Demo data only. Replace via src/services/api.ts when the backend is ready.
export const student={name:'Demo Student',streak:5,solved:24,accuracy:76}
export const learningPath=[
 {id:1,title:'Logic Foundations',status:'done'},{id:2,title:'Variables and Conditions',status:'done'},
 {id:3,title:'Loops and Iterations',status:'active'},{id:4,title:'Arrays and Strings',status:'locked'},{id:5,title:'DSA Adventure',status:'locked'}] as {id:number,title:string,status:string}[]
export const skills=[{n:'Logical Thinking',v:80},{n:'Programming Fundamentals',v:68},{n:'DSA',v:40},{n:'Debugging',v:55},{n:'Independent Coding',v:35}]
export const games=[
 {id:'pattern',title:'Pattern Detective',level:'Beginner',min:5,xp:50,desc:'Find the rule in a sequence.'},
 {id:'sequencer',title:'Step Sequencer',level:'Beginner',min:5,xp:60,desc:'Put logic blocks in order.'},
 {id:'vault',title:'Variable Vault',level:'Beginner',min:4,xp:50,desc:'Predict how values change.'},
 {id:'cond',title:'Condition Master',level:'Intermediate',min:8,xp:80,desc:'Predict if/else outcomes.'},
 {id:'loop',title:'Loop Runner',level:'Intermediate',min:8,xp:90,desc:'Control a robot with loops.'},
 {id:'arch',title:'Algorithm Architect',level:'Advanced',min:12,xp:120,desc:'Assemble search and sort steps.'},
 {id:'debug',title:'Debugging Detective',level:'Intermediate',min:10,xp:80,desc:'Find the wrong line.'},
 {id:'maze',title:'Memory Maze',level:'Advanced',min:12,xp:110,desc:'Trace calls and memory.'}]
export const dryRun={code:['total = 0','for i in range(1, 4):','    total = total + i','print(total)'],
 steps:[
 {line:0,i:null,total:0,out:'',t:'total is created and set to 0.'},
 {line:1,i:1,total:0,out:'',t:'The loop starts. range(1, 4) gives 1, 2, 3 (4 is not included), so i = 1.'},
 {line:2,i:1,total:1,out:'',t:'total was 0. Add i (1), so total becomes 1.'},
 {line:1,i:2,total:1,out:'',t:'Next iteration: i = 2.'},
 {line:2,i:2,total:3,out:'',t:'total was 1. Add 2, so total becomes 3.'},
 {line:1,i:3,total:3,out:'',t:'Last iteration: i = 3.'},
 {line:2,i:3,total:6,out:'',t:'total was 3. Add 3, so total becomes 6.'},
 {line:3,i:3,total:6,out:'6',t:'The loop is finished. print(total) outputs 6.'}] as {line:number,i:number|null,total:number,out:string,t:string}[]}
export const dsa=[
 {l:1,n:'Foundations',t:'Arrays, Strings, Linear Search, Basic Sorting',s:'done'},
 {l:2,n:'Linear Structures',t:'Linked Lists, Stacks, Queues, Hash Tables',s:'active'},
 {l:3,n:'Problem-Solving Patterns',t:'Two Pointers, Sliding Window, Binary Search, Recursion',s:'active'},
 {l:4,n:'Advanced Structures',t:'Trees, Heaps, Graphs, Tries',s:'locked'},
 {l:5,n:'Advanced Algorithms',t:'Greedy, Dynamic Programming, Graph Algorithms',s:'locked'}]
export const languages=[{id:'python',n:'Python',done:4,total:9,lv:'Level 3',mods:['Variables and Data Types','Operators','Conditions','Loops','Lists and Strings','Functions','Dictionaries and Sets','OOP','Algorithms and DSA']},
 {id:'c',n:'C',done:2,total:10,lv:'Level 2',mods:['Types and I/O','Operators','Conditions','Loops','Arrays','Strings','Functions','Pointers','Structures','Files']},
 {id:'cpp',n:'C++',done:1,total:10,lv:'Level 1',mods:['Fundamentals','Functions','Arrays','Classes','STL','Vectors','Stacks and Queues','Maps','Algorithms','Templates']},
 {id:'java',n:'Java',done:1,total:9,lv:'Level 1',mods:['Syntax','Methods','Arrays','OOP','Inheritance','Collections','Exceptions','Streams','DSA']}]
export const badges=[{n:'Logic Starter',on:true},{n:'Loop Explorer',on:true},{n:'Bug Hunter',on:false},{n:'Array Adventurer',on:false},{n:'Independent Thinker',on:false}]
export const readiness={score:62,parts:[['Logic and computational thinking',78],['Programming fundamentals',64],['DSA problem solving',41],['Independent coding',45],['Debugging and complexity',58]] as [string,number][],
 history:[['Baseline logic test','2026-09-02','58/100','Easy','Completed'],['Loops mastery check','2026-10-05','71/100','Medium','Completed'],['Independent coding 1','2026-10-20','45/100','Medium','Completed']],
 plan:[['Improve loop-based problems','/arena'],['Practise array traversal','/lab'],['Attempt binary search','/dsa']] as [string,string][]}
export const battles=[['Weekly Logic Sprint','Upcoming','Sat 10:00'],['Loop Lightning','Upcoming','Next Tue'],['Pattern Rush','Completed','Rank 12 of 40 (sample)']]
export const debugQs=[{c:'for i in range(1, 5):\n    print(i)',q:'What does this program print?',o:['1 2 3 4','1 2 3 4 5','0 1 2 3 4','2 3 4 5'],a:0,e:'range(1, 5) stops before 5, so it prints 1, 2, 3, 4.'},
 {c:'total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)  # goal: sum of 1 to 5',q:'The goal is 15 but it prints 10. Which fix is correct?',o:['range(1, 6)','total = 1','print(i)','range(0, 5)'],a:0,e:'The end value is excluded. range(1, 6) includes 5, so the sum is 15.'}]
