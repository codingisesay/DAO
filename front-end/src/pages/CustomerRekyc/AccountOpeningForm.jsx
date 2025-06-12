import { useState } from "react";
import ProgressIndicator from "./ProgressIndicator";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2JobDetails from "./Step2PersonalD";
import Step3Nomination from "./Step3DocumentUpload";
import Step4VideoCall from "./Step4VideoCall"; 
import "./style.css";

function CustomerForm() {
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        // Authentication Details
        begin_process: null,
        auth_type: null, // 'Pan Card', 'Aadhar Card', 'Digilocker'
        auth_code: '',
        status: 'pending',

        // Application Details
        application_no: '',
        application_id: null,

        // Personal Information
        first_name: '',
        middle_name: '',
        last_name: '',
        salutation: 'MR', // 'MR', 'MRS', 'MISS'
        DOB: '',
        gender: null, // 'Male', 'Female', 'Others'
        religion: 'HINDU', // 'HINDU', 'MUSLIM'
        caste: '',
        marital_status: 'SINGLE', // 'MARRIED', 'SINGLE'

        // Contact Information
        mobile: '',
        alt_mob_no: '',
        email: '',
        fullName: "", // Keeping your original field

        // Address Information - Permanent
        complex_name: '',
        flat_no: '',
        area: '',
        landmark: '',
        country: '',
        pincode: '',
        city: '',
        district: '',
        state: '',
        correspondenceAddressSame: "",
        // Address Information - Correspondence (nullable)
        cor_complex: '',
        cor_flat_no: '',
        cor_area: '',
        cor_landmark: '',
        cor_country: '',
        cor_pincode: '',
        cor_city: '',
        cor_district: '',
        cor_state: '',

        // Identity Documents
        adhar_card: '',
        pan_card: '',
        passport: '',
        driving_license: '',
        voter_id: '',

        // Location Data
        longitude: '',
        latitude: '',

        // Family Details
        father_prefix_name: 'MR', // 'MR', 'MRS'
        father_first_name: '',
        father_middle_name: '',
        father_last_name: '',
        mother_prefix_name: 'MRS', // 'MR', 'MRS'
        mother_first_name: '',
        mother_middle_name: '',
        mother_last_name: '',
        birth_place: '',
        birth_country: '',

        // Occupation Details
        occoupation_type: '',
        occupation_name: '',
        if_salaryed: null, // 'YES', 'NO'
        designation: '',
        nature_of_occoupation: '',
        qualification: '',
        anual_income: '',
        // remark: '',

        // Job Details (keeping your original fields)
        jobDetails: '',
        salaryDetails: '',
        // Personal Details
        maidenPrefixName: '',
        maidenFirstName: '',
        maidenMiddleName: '',
        maidenLastName: '',

        fatherSpousePrefixName: '',
        fatherSpouseFirstName: '',
        fatherSpouseMiddleName: '',
        fatherSpouseLastName: '',

        motherPrefixName: 'MRS',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',

        birthPlaceCity: '',
        birthPlaceCountry: '',
        maritalStatus: 'SINGLE',
        nationality: '',
        // religion: 'HINDU',
        // caste: '',

        // Occupation Details
        occupationType: '',
        businessName: '',
        salariedWith: '',
        // designation: '',
        organisationNature: '',
        educationQualification: '',
        annualIncome: '',
        remark: '',
        // Nomination Details
        nominationDetails: [],
        relationship: '',
        percentage: '',
        age: '',
        nom_complex_name: '',
        nom_flat_no: '',
        nom_area: '',
        nom_landmark: '',
        nom_country: '',
        nom_pincode: '',
        nom_city: '',
        nom_state: '',
        nom_district: '',
        nom_mobile: '',

        // Video Call
        videoCall: false,

        // File Uploads
        photo: null,
        signature: null,
        files: [], // For multiple file uploads
        bankFacility: {
            eBankingServices: {
                atmCard: false,
                upi: false,
                internetBanking: false,
                imps: false
            },
            creditFacilities: {
                consumerLoan: false,
                homeLoan: false,
                businessLoan: false,
                educationLoan: false,
                carLoan: false,
                staff: false,
                relativeFriend: false,
                other: false
            },
            otherFacilityText: ''
        },
        // Additional data
        data: null // For storing complete application data

    });
    const [progress, setProgress] = useState({
        1: "inprogress",
        2: "pending",
        3: "pending",
        4: "pending",
        // 5: "pending",
        // 6: "pending",
    });
    const [subProgress, setSubProgress] = useState({
        "2A": "pending",
        "2B": "pending",
        "2C": "pending",
    });
    const [subProgress5, setSubProgress5] = useState({
        "5A": "pending",
        "5B": "pending",
        "5C": "pending",
    });


    const handleChange = (e) => {
        // Handle both event objects and direct updates
        if (e && e.target) {
            // Standard form input event
            const { name, value, type, checked, files } = e.target;
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
            });
        } else {
            // Direct update (like from address form)
            setFormData({
                ...formData,
                ...e
            });
        }
    };
    const handleTypeChange = (type) => {
        setFormData({ ...formData, begin_process: type });
    };

    const handleOptionChange = (option) => {
        setFormData({ ...formData, auth_type: option });
    };
    const nextStep = () => {
        console.log('Updated formdata : ', formData)
        if (currentStep === 1) {
            setProgress({ ...progress, 1: "completed", 2: "inprogress" });
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setProgress({ ...progress, 2: "completed", 3: "inprogress" });
            setCurrentStep(3);
        } else if (currentStep === 3) {
            setProgress({ ...progress, 3: "completed", 4: "inprogress" });
            setCurrentStep(4);
        } else if (currentStep === 4) {
            setProgress({ ...progress, 4: "completed", 5: "inprogress" });
            setCurrentStep(5);
        } else if (currentStep === 5) {
            setProgress({ ...progress, 5: "completed", 6: "inprogress" });
            setCurrentStep(6);
        }
    };

    const prevStep = () => {
        if (currentStep === 2) {
                setProgress({ ...progress, 12: "inprogress", 2: "pending" });
        } else if (currentStep === 3) {
            setProgress({ ...progress, 2: "inprogress", 3: "pending" });
            setCurrentStep(2);
        } else if (currentStep === 4) {
            setProgress({ ...progress, 3: "inprogress", 4: "pending" });
            setCurrentStep(3);
        } else if (currentStep === 5) {
            // setProgress({ ...progress, 4: "inprogress", 5: "pending" });
            // setCurrentStep(4);
        }
    };

    const skipStep = () => {
        if (currentStep === 4) {
            setProgress({ ...progress, 4: "skipped", 5: "inprogress" });
            setCurrentStep(5);
        } else {
            nextStep();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setProgress({ ...progress, 5: "completed" });
        alert("Form submitted successfully!");
    };

    const updateStep2Progress = (subStep, status) => {
        setSubProgress(prev => ({
            ...prev,
            [subStep]: status
        }));
    };
    const updateStep5Progress = (subStep, status) => {
        setSubProgress(prev => ({
            ...prev,
            [subStep]: status
        }));
    };

    const completeStep2 = () => {
        setProgress({ ...progress, 2: "completed", 3: "inprogress" });
        setCurrentStep(3);
    };
    const completeStep5 = () => {
        setProgress({ ...progress, 5: "completed", 6: "inprogress" });
        setCurrentStep(6);
    };

    // Add this handler
    const handleAadharDataFetched = (data) => {
        setFormData(prev => ({
            ...prev,
            ...data // Merge fetched data into formData
        }));
        setProgress({ ...progress, 1: "completed", 2: "inprogress" });
        setCurrentStep(2); // Move to Step 2
    };

    return (
        <div className="enrollment-form-container p-1">
            <div className='flex justify-around items-center flex-wrap'>
                <div className='xl:w-1/5 lg:w-1/4 md:w-2/6 sm:w-1/3 p-1'>

                    <ProgressIndicator
                        progress={progress}
                        subProgress={subProgress}
                        currentStep={currentStep}
                    />

                </div>
                <div className='xl:w-4/5 lg:w-3/4 md:w-4/6 sm:w-2/3 p-1'>
                {/* {currentStep} */}
                    <div className='work-area dark:bg-gray-900'>
                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                {currentStep === 1 && (
                                    <Step1PersonalInfo
                                        formData={formData}
                                        handleChange={handleChange}
                                        onAadharDataFetched={handleAadharDataFetched} // <-- Pass handler
                                    />
                                )}

                                {currentStep === 2 && (
                                    <Step2JobDetails
                                        formData={formData}
                                        handleChange={handleChange}
                                        updateProgress={updateStep2Progress}
                                        subProgress={subProgress}
                                        completeStep={completeStep2}
                                        nextStep={nextStep}
                                        prevStep={prevStep}
                                    />
                                )}

                                {currentStep === 3 && (
                                    <Step3Nomination
                                        formData={formData}
                                        handleChange={handleChange}
                                        nextStep={nextStep}
                                        prevStep={prevStep}
                                    />
                                )}

                                {currentStep === 4 && (
                                    <Step4VideoCall
                                        formData={formData}
                                        handleChange={handleChange}
                                        nextStep={nextStep}
                                        prevStep={prevStep}
                                        skipStep={skipStep}
                                    />
                                )}

                  
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerForm;
