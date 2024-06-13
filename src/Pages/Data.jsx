export const data = {
    columns: [
        {
            field:"id",
            // groupable:false,
            headerName:"S.No",
            width:200
        },
        {
            field:"Name",
            groupable:false,
            headerName:"Name",
            width:200
        },
        {
            field:"Roll No",
            headerName:"Roll No",
            width:200
        },
        {
            field:"Department",
            headerName:"Department",
            width:200
        },
        {
            field:"CGPI",
            headerName:"CGPI",
            width:200
        },
    ],
    rows: [
    { "id": 1, "Name": "Frederic Taberer", "Roll No": 1, "Department": "Crest Line", "CGPI": 6.9 },
    { "id": 2, "Name": "Correy Treacher", "Roll No": 2, "Department": "Cascade", "CGPI": 7.2 },
    { "id": 3, "Name": "Gibby Jacob", "Roll No": 3, "Department": "Northfield", "CGPI": 3.8 },
    { "id": 4, "Name": "Andria Crooks", "Roll No": 4, "Department": "Anhalt", "CGPI": 3.1 },
    { "id": 5, "Name": "Mame Vennart", "Roll No": 5, "Department": "Colorado", "CGPI": 4.3 },
    { "id": 6, "Name": "Xena Kettle", "Roll No": 6, "Department": "Stang", "CGPI": 7.7 },
    { "id": 7, "Name": "Nicholle Housden", "Roll No": 7, "Department": "Eastwood", "CGPI": 7.4 },
    { "id": 8, "Name": "Valaria Coy", "Roll No": 8, "Department": "Truax", "CGPI": 9.1 },
    { "id": 9, "Name": "Tobey Hoolaghan", "Roll No": 9, "Department": "North", "CGPI": 1.0 },
    { "id": 10, "Name": "Laetitia Chazelle", "Roll No": 10, "Department": "Vahlen", "CGPI": 3.3 },
    { "id": 11, "Name": "Frederic Taberer", "Roll No": 1, "Department": "Crest Line", "CGPI": 6.9 },
    { "id": 12, "Name": "Correy Treacher", "Roll No": 2, "Department": "Cascade", "CGPI": 7.2 },
    { "id": 13, "Name": "Gibby Jacob", "Roll No": 3, "Department": "Northfield", "CGPI": 3.8 },
    { "id": 14, "Name": "Andria Crooks", "Roll No": 4, "Department": "Anhalt", "CGPI": 3.1 },
    { "id": 15, "Name": "Mame Vennart", "Roll No": 5, "Department": "Colorado", "CGPI": 4.3 },
    { "id": 16, "Name": "Xena Kettle", "Roll No": 6, "Department": "Stang", "CGPI": 7.7 },
    { "id": 17, "Name": "Nicholle Housden", "Roll No": 7, "Department": "Eastwood", "CGPI": 7.4 },
    { "id": 18, "Name": "Valaria Coy", "Roll No": 8, "Department": "Truax", "CGPI": 9.1 },
    { "id": 19, "Name": "Tobey Hoolaghan", "Roll No": 9, "Department": "North", "CGPI": 1.0 },
    { "id": 20, "Name": "Laetitia Chazelle", "Roll No": 10, "Department": "Vahlen", "CGPI": 3.3 }
  ]
}

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      // width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: '20%',
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: '20%',
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      // width: 160,
      // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];