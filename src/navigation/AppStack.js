import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../src/components/Home';
import AboutUs from '../../src/components/About/AboutUs';
import SelectSubject from '../../src/components/SelectSubject';
import SkillAssessment from '../../src/components/SkillAssessment';
import MainNavigator from '../../src/navigation/MainNavigator';
import FreeCounselling from '../../src/components/FreeCounselling';
import BuyPackage from '../../src/components/Packages/BuyPackage';
import MakePayment from '../../src/components/Packages/MakePayment';
import PackageMenu from '../../src/components/Packages/PackageMenu';
import MyPackages from '../../src/components/Packages/MyPackages';
import Subject from '../../src/components/Subject';
import Questions from '../../src/components/QuestionsPaper';
import AfterExam from '../components/AfterExam';
import LearningAnalysis from '../components/SkillAssesment/LearningAnalysis';
import ReportCard from '../components/ReportCard';
import SubmitSheet from '../components/Submit-Sheets/SubmitSheet';
import ConfirmSubmit from '../components/Submit-Sheets/ConfirmSubmit';
import Support from '../components/Support/Support';
import Status from '../components/Support/Status';
import SendFeedBack from '../components/Support/SendFeedBack';
import CreateSupport from '../components/Support/CreateSupport';
import ScheduleWork from '../components/ScheduleWork';
import ViewSchedule from '../components/ViewSchedule';
import LearnSelectSubject from '../components/LearnMore/LearnSelectSubject';
import SelectBoard from '../components/LearnMore/SelectBoard';
import SelectMedium from '../components/LearnMore/SelectMedium';
import SelectChapter from '../components/LearnMore/SelectChapter';
import ChapterDetails from '../components/LearnMore/ChapterDetails';
import AskDoubts from '../components/AskDoubts/AskDoubts';
import SheetDoubt from '../components/AskDoubts/SheetDoubt';
import AskDoubtsDetails from '../components/AskDoubts/AskDoubtsDetails';
import AnswerDetails from '../components/AskDoubts/AnswerDetails';
import DoubtsList from '../components/AskDoubts/DoubtsList';
import NewDoubts from '../components/AskDoubts/NewDoubts';
import CloudClasses from '../components/Cloud/CloudClasses';
import SheetMenu from '../components/Submit-Sheets/SheetMenu';
import ScheduleCloudClass from '../components/Cloud/ScheduleCloudClass';
import Rewards from '../components/Rewards/Rewards';
import OnlineMenu from '../components/practise/OnlineMenu';
import ExtraPractise from '../components/practise/ExtraPractise';
import PathToSuccess from '../components/practise/PathToSuccess';
import AdaptivePractise from '../components/practise/AdaptivePractise';
import CompetativePractise from '../components/practise/CompetativePractise';
import OnlinePractiseQuestions from '../components/OnlinePractiseQuestions';
import OnlineExams from '../components/practise/OnlineExams';
import Report from '../components/practise/Report';
import UpcommingVideoCalls from '../components/Videocalls/UpcommingVideoCalls';
import PreviousVideoCalls from '../components/Videocalls/PreviousVideoCalls';
import ScheduleVideoCalls from '../components/Videocalls/ScheduleVideoCalls';
import GiveRating from '../components/Videocalls/GiveRating';
import SheetStatus from '../components/Submit-Sheets/SheetStatus';
import PendingSheets from '../components/Submit-Sheets/PendingSheets';
import LearningGaps from '../components/Submit-Sheets/LearningGaps';
import LearningGapsType from '../components/SkillAssesment/LearningGapsType';
import LearningGuide from '../components/LearningGuide/LearningGuide';
import GuideVideos from '../components/LearningGuide/GuideVideos';
import AddVideoCalls from '../components/Videocalls/AddVideoCalls';
import Login from '../components/Auth/Login';
import SwitchStudent from '../components/SwitchStudent';
import AboutWebView from '../components/AboutWebView';
import AddStudent from '../components/AddStudent';
import PdfViewer from '../components/LearningGuide/PdfViewer';
import YoutubeVideo from '../components/LearningGuide/YoutubeVideo';
import SubmitSheet2 from '../components/Submit-Sheets/SubmitSheet2';
import SubmitSheet3 from '../components/Submit-Sheets/SubmitSheet3';
import VideoComponent from '../components/LearningGuide/VideoComponent';
import SheetReportDetails from '../components/SheetReportDetails';
import ImageGallery from '../components/About/ImageGallery';
import ImageViewer from '../components/About/ImageViewer';
import SheetVideo from '../components/Submit-Sheets/SheetVideo';
import UploadVideo from '../components/Submit-Sheets/UploadVideo';
import SheetVideoMenu from '../components/Submit-Sheets/SheetVideoMenu';
import VideoSheetStatus from '../components/Submit-Sheets/VideoSheetStatus';
import PendingVideoSheets from '../components/Submit-Sheets/PendingVideoSheets';
import SubjectAssesmentDetails from '../components/SkillAssesment/SubjectAssesmentDetails';
import VideoSheetReportDetails from '../components/Submit-Sheets/VideoSheetReportDetails';
import PendingTasks from '../components/Tasks/PendingTasks';
import CompletedTasks from '../components/Tasks/CompletedTasks';
import TaskDetails from '../components/Tasks/TaskDetails';
import TaskAnswer from '../components/Tasks/TaskAnswer';
import VideoPlayer from '../components/VideoPlayer';
import RewardsMenu from '../components/Rewards/RewardsMenu';
import MyRewards from '../components/Rewards/MyRewards';
import OnlinePratiseQuestionPaper from '../components/practise/OnlinePratiseQuestionPaper';
import ExtraPratiseQuestionPaper from '../components/practise/ExtraPratiseQuestionPaper';
import AdaptiveSheetReportDetails from '../components/practise/AdaptiveSheetReportDetails';
import ExtraPractiseReportDetails from '../components/practise/ExtraPractiseReportDetails';
import CompetativeQuestionPaper from '../components/practise/CompetativeQuestionPaper';
import CompetativeReport from '../components/practise/CompetativeReport';
import CompetativeSheetReport from '../components/practise/CompetativeSheetReport';
import AdaptiveSubjectReport from '../components/practise/AdaptiveSubjectReport';

const Stack = createStackNavigator()
export default function AppStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddStudent" component={AddStudent} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RewardsMenu" component={RewardsMenu} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="MainNavigator" component={MainNavigator} />
            <Stack.Screen name="SkillAssessment" component={SkillAssessment} />
            <Stack.Screen name="SelectSubject" component={SelectSubject} />
            <Stack.Screen name="FreeCounselling" component={FreeCounselling} />
            <Stack.Screen name="BuyPackage" component={BuyPackage} />
            <Stack.Screen name="MakePayment" component={MakePayment} />
            <Stack.Screen name="MyPackages" component={MyPackages} />
            <Stack.Screen name="Subject" component={Subject} />
            <Stack.Screen name="Questions" component={Questions} />
            <Stack.Screen name="AfterExam" component={AfterExam} />
            <Stack.Screen name="LearningAnalysis" component={LearningAnalysis} />
            <Stack.Screen name="ReportCard" component={ReportCard} />
            <Stack.Screen name="SubmitSheet" component={SubmitSheet} />
            <Stack.Screen name="ConfirmSubmit" component={ConfirmSubmit} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Report" component={Report} />
            <Stack.Screen name="Status" component={Status} />
            <Stack.Screen name="SubmitSheet2" component={SubmitSheet2} />
            <Stack.Screen name="SubmitSheet3" component={SubmitSheet3} />
            <Stack.Screen name="CreateSupport" component={CreateSupport} />
            <Stack.Screen name="ScheduleWork" component={ScheduleWork} />
            <Stack.Screen name="PackageMenu" component={PackageMenu} />
            <Stack.Screen name="ViewSchedule" component={ViewSchedule} />
            <Stack.Screen name="LearnSelectSubject" component={LearnSelectSubject} />
            <Stack.Screen name="SelectBoard" component={SelectBoard} />
            <Stack.Screen name="SelectMedium" component={SelectMedium} />
            <Stack.Screen name="SelectChapter" component={SelectChapter} />
            <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
            <Stack.Screen name="AskDoubts" component={AskDoubts} />
            <Stack.Screen name="SheetDoubt" component={SheetDoubt} />
            <Stack.Screen name="DoubtsList" component={DoubtsList} />
            <Stack.Screen name="NewDoubts" component={NewDoubts} />
            <Stack.Screen name="CloudClasses" component={CloudClasses} />
            <Stack.Screen name="SheetMenu" component={SheetMenu} />
            <Stack.Screen name="Rewards" component={Rewards} />
            <Stack.Screen name="ScheduleCloudClass" component={ScheduleCloudClass} />
            <Stack.Screen name="OnlineMenu" component={OnlineMenu} />
            <Stack.Screen name="ExtraPractise" component={ExtraPractise} />
            <Stack.Screen name="PathToSuccess" component={PathToSuccess} />
            <Stack.Screen name="AdaptivePractise" component={AdaptivePractise} />
            <Stack.Screen name="AdaptiveSheetReportDetails" component={AdaptiveSheetReportDetails} />
            <Stack.Screen name="CompetativePractise" component={CompetativePractise} />
            <Stack.Screen name="OnlinePractiseQuestions" component={OnlinePractiseQuestions} />
            <Stack.Screen name="OnlineExams" component={OnlineExams} />
            <Stack.Screen name="UpcommingVideoCalls" component={UpcommingVideoCalls} />
            <Stack.Screen name="PreviousVideoCalls" component={PreviousVideoCalls} />
            <Stack.Screen name="ScheduleVideoCalls" component={ScheduleVideoCalls} />
            <Stack.Screen name="SheetStatus" component={SheetStatus} />
            <Stack.Screen name="PendingSheets" component={PendingSheets} />
            <Stack.Screen name="LearningGaps" component={LearningGaps} />
            <Stack.Screen name="LearningGapsType" component={LearningGapsType} />
            <Stack.Screen name="LearningGuide" component={LearningGuide} />
            <Stack.Screen name="GuideVideos" component={GuideVideos} />
            <Stack.Screen name="AddVideoCalls" component={AddVideoCalls} />
            <Stack.Screen name="SwitchStudent" component={SwitchStudent} />
            <Stack.Screen name="VideoComponent" component={VideoComponent} />
            <Stack.Screen name="AboutWebView" component={AboutWebView} />
            <Stack.Screen name="PdfViewer" component={PdfViewer} />
            <Stack.Screen name="YoutubeVideo" component={YoutubeVideo} />
            <Stack.Screen name="ImageGallery" component={ImageGallery} />
            <Stack.Screen name="OnlinePratiseQuestionPaper" component={OnlinePratiseQuestionPaper} />
            <Stack.Screen name="ExtraPratiseQuestionPaper" component={ExtraPratiseQuestionPaper} />
            <Stack.Screen name="ImageViewer" component={ImageViewer} />
            <Stack.Screen name="SheetReportDetails" component={SheetReportDetails} />
            <Stack.Screen name="SheetVideo" component={SheetVideo} />
            <Stack.Screen name="UploadVideo" component={UploadVideo} />
            <Stack.Screen name="SubjectAssesmentDetails" component={SubjectAssesmentDetails} />
            <Stack.Screen name="AskDoubtsDetails" component={AskDoubtsDetails} />
            <Stack.Screen name="AnswerDetails" component={AnswerDetails} />
            <Stack.Screen name="VideoSheetStatus" component={VideoSheetStatus} />
            <Stack.Screen name="PendingVideoSheets" component={PendingVideoSheets} />
            <Stack.Screen name="SheetVideoMenu" component={SheetVideoMenu} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
            <Stack.Screen name="PendingTasks" component={PendingTasks} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
            <Stack.Screen name="TaskAnswer" component={TaskAnswer} />
            <Stack.Screen name="CompletedTasks" component={CompletedTasks} />
            <Stack.Screen name="MyRewards" component={MyRewards} />
            <Stack.Screen name="SendFeedBack" component={SendFeedBack} />
            <Stack.Screen name="GiveRating" component={GiveRating} />
            <Stack.Screen name="VideoSheetReportDetails" component={VideoSheetReportDetails} />
            <Stack.Screen name="ExtraPractiseReportDetails" component={ExtraPractiseReportDetails} />
            <Stack.Screen name="CompetativeQuestionPaper" component={CompetativeQuestionPaper} />
            <Stack.Screen name="CompetativeReport" component={CompetativeReport} />
            <Stack.Screen name="CompetativeSheetReport" component={CompetativeSheetReport} />
            <Stack.Screen name="AdaptiveSubjectReport" component={AdaptiveSubjectReport} />
        </Stack.Navigator>
    )
}