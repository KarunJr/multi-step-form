// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import type { CompanySchema } from "@/types";
// import { useEffect, useState } from "react"

// const Companies = () => {
//   const [companies, setCompanies] = useState<CompanySchema[]>([])
//   const [open, setOpen] = useState(false)
//   const fetchCompanies = async () => {
//     try {
//       const response = await fetch("http://localhost:3000", { method: "GET" });
//       const data = await response.json();

//       if (data.success) {
//         console.log("Company:", data.companies);


//         setCompanies(data.companies);
//       }
//     } catch (error) {
//       console.error("Error in fetchCompanies(): ", error)
//     }
//   }
//   useEffect(() => {
//     fetchCompanies();
//   }, [])
//   return (
//     <div className="px-6 space-y-4">
//       <h1 className="text-xl font-bold">Companies</h1>
//       {
//         companies && companies?.length > 0 && (
//           <div className="grid sm:grid-cols-3 gap-2">
//             {
//               companies.map((company) => (
//                 <div key={company.panNumber}>
//                   <Card className="">
//                     <CardHeader>
//                       <CardTitle className="font-medium text-xl">{company.companyName}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="mb-3">
//                       <div>
//                         <p>PAN No.: {company.panNumber}</p>
//                         <p>Total Capital Invested: {company.totalCapitalInvested}</p>
//                         <p>Number of Shareholders: {company.numberOfShareholders}</p>
//                       </div>
//                       <div className="text-end">
//                         <button
//                           className="text-gray-500 hover:underline hover:text-gray-700 text-sm cursor-pointer"
//                           onClick={() => setOpen(!open)}
//                         >
//                           View Shareholders
//                         </button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Dialog open={open} onOpenChange={setOpen}>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Share Holders</DialogTitle>
//                         <DialogDescription>
//                           <Table>
//                             <TableHeader>
//                               <TableRow>
//                                 <TableHead>First Name</TableHead>
//                                 <TableHead>Last Name</TableHead>
//                                 <TableHead>Nationality</TableHead>
//                               </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                               {
//                                 company.shareholders?.map((sh, idx) => (
//                                   <TableRow key={idx}>
//                                     <TableCell>{sh.firstName}</TableCell>
//                                     <TableCell>{sh.lastName}</TableCell>
//                                     <TableCell>{sh.nationality}</TableCell>
//                                   </TableRow>
//                                 ))
//                               }
//                             </TableBody>
//                           </Table>
//                         </DialogDescription>
//                       </DialogHeader>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               ))
//             }
//           </div>
//         )
//       }
//     </div>
//   )
// }

// export default Companies

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CompanySchema } from "@/types";
import { useEffect, useState } from "react";

const Companies = () => {
  const [companies, setCompanies] = useState<CompanySchema[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanySchema | null>(null);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3000", { method: "GET" });
      const data = await response.json();

      if (data.success) {
        console.log("Fetched Companies:", data.companies);
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="px-6 space-y-4">
      <h1 className="text-xl font-bold">Companies</h1>

      {companies.length > 0 ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {companies.map((company, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="font-medium text-xl">{company.companyName}</CardTitle>
              </CardHeader>
              <CardContent className="mb-3">
                <div>
                  <p>PAN No.: {company.panNumber}</p>
                  <p>Total Capital Invested: {company.totalCapitalInvested}</p>
                  <p>Number of Shareholders: {company.numberOfShareholders}</p>
                </div>
                <div className="text-end mt-2">
                  <button
                    className="text-gray-500 hover:underline hover:text-gray-700 text-sm cursor-pointer"
                    onClick={() => setSelectedCompany(company)}
                  >
                    View Shareholders
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="flex justify-center items-center h-[50vh]">No companies found!</p>
      )}

      {/* Dialog for showing shareholders */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        {selectedCompany && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shareholders of {selectedCompany.companyName}</DialogTitle>
              <DialogDescription>
                {selectedCompany.shareholders && selectedCompany.shareholders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Nationality</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany.shareholders.map((sh, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{sh.firstName}</TableCell>
                          <TableCell>{sh.lastName}</TableCell>
                          <TableCell>{sh.nationality}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No shareholders found for this company.</p>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Companies;