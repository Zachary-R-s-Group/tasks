/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { CoursePlan, SemesterI, yearI } from "./interfaces/semester";
import { Course } from "./interfaces/course";
//import React, { useState } from "react";
import "./App.css";
//import { ClearCourseModal } from "./ClearCourseModal";
//import { AddCourseModal } from "./AddCourseModal";
import {
    clearallsemester,
    DeleteCourseFromSemester,
    UpdateCoureplanYear,
    deleteMultipleCoursesFromSemester,
    removeSemesterYear
} from "./DBmanage";
import { AddSemesterModal } from "./AddSemesterModal";
//import { JsxAttribute } from "typescript";
//const [CurrentModalCourse, setCurrentModalCourse] = useState<Course>();

function Semester({
    rendSemester,
    edit,
    clickToDeleteFromSemester,
    updateCoursePlan,
    coursePlan,
    backToQueue
}: {
    rendSemester: SemesterI;
    updateCoursePlan: (newCoursePlan: CoursePlan) => void;
    coursePlan: CoursePlan;
    edit: (course: Course) => void;
    clickToDeleteFromSemester: (
        courseUUID: string,
        currentSemester: SemesterI
    ) => void;
    backToQueue: (sendcourse: Course, seemester: SemesterI) => void;
}): JSX.Element {
    const deleteAllCoursesFromSemester = () => {
        const courseUUIDs = rendSemester.courses
            .map((course) => course.UUID)
            .filter((uuid): uuid is string => uuid !== undefined);

        const updatedCoursePlan = deleteMultipleCoursesFromSemester(
            courseUUIDs,
            rendSemester,
            coursePlan
        );

        updateCoursePlan(updatedCoursePlan);
    };
    return (
        <Table striped bordered hover className="tight">
            <thead>
                <tr>
                    <th>Course ID</th>
                    <th>Name</th>
                    <th>Credits</th>
                </tr>
            </thead>
            <tbody>
                {rendSemester.courses.map((rendCourse: Course): JSX.Element => {
                    //console.log("render course:");
                    //console.log(rendCourse);
                    return (
                        <tr
                            onClick={() => {
                                edit(rendCourse);
                            }}
                            key={rendCourse.UUID}
                        >
                            <td>{rendCourse.ticker}</td>
                            <td>{rendCourse.name}</td>
                            <td>{rendCourse.credits}</td>
                            <td>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (rendCourse.UUID) {
                                            clickToDeleteFromSemester(
                                                rendCourse.UUID,
                                                rendSemester
                                            );
                                        }
                                    }}
                                    style={{
                                        backgroundColor: "red"
                                    }}
                                >
                                    Delete
                                </button>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        backToQueue(rendCourse, rendSemester);
                                    }}
                                    variant="info"
                                >
                                    Queue
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={2}>Totals Credits</th>
                    <td>
                        {rendSemester.courses.reduce(
                            (
                                creditsCount: number,
                                rendCourse: Course
                            ): number => creditsCount + rendCourse.credits,
                            0
                        )}
                    </td>
                </tr>
            </tfoot>
        </Table>
    );
}

function Year({
    year,
    editCourse,
    selectedSemester,
    updateYear,
    addSemesterToYear,
    clickToDeleteFromSemester,
    coursePlan,
    updateCoursePlan,
    backToQueue
}: {
    year: yearI;
    editCourse: (course: Course) => void;
    selectedSemester: (semester: SemesterI) => void;
    updateYear: (updateYear: yearI) => void;
    coursePlan: CoursePlan;
    updateCoursePlan: (courseplan: CoursePlan) => void;
    addSemesterToYear: () => void;
    clickToDeleteFromSemester: (
        courseUUID: string,
        currentSemester: SemesterI
    ) => void;
    backToQueue: (sendcourse: Course, seemester: SemesterI) => void;
}): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function DisplaySemester(year: yearI, index: number): SemesterI | null {
        const seasons: SemesterI[] = [];

        if (year.winter) {
            seasons.push(year.winter);
        }
        if (year.spring) {
            seasons.push(year.spring);
        }
        if (year.summer) {
            seasons.push(year.summer);
        }
        if (year.fall) {
            seasons.push(year.fall);
        }
        return seasons.length > index ? seasons[index] : null;
    }
    let columncount = 0;
    if (year.winter) {
        columncount++;
    }
    if (year.spring) {
        columncount++;
    }
    if (year.summer) {
        columncount++;
    }
    if (year.fall) {
        columncount++;
    }
    return (
        <div>
            <Table style={{ tableLayout: "fixed" }} bordered size="sm">
                <thead>
                    <tr>
                        <th colSpan={columncount}>
                            {year.name}{" "}
                            <Button
                                variant="primary"
                                onClick={addSemesterToYear}
                                className="float-end"
                            >
                                Add Semester
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {year.fall && (
                            <th>
                                Fall
                                <ButtonGroup style={{ display: "flex" }}>
                                    <Button
                                        variant="success"
                                        onClick={() =>
                                            selectedSemester(year.fall!)
                                        }
                                        className="float-end"
                                    >
                                        AddQueue
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            updateYear({
                                                ...year,
                                                fall: {
                                                    ...year.fall,
                                                    courses: []
                                                } as SemesterI
                                            })
                                        }
                                        className="float-end"
                                    >
                                        Clear semester
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="float-end"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            updateYear(
                                                removeSemesterYear(
                                                    year,
                                                    year.fall!
                                                )
                                            );
                                        }}
                                    >
                                        remove
                                    </Button>
                                </ButtonGroup>
                            </th>
                        )}
                        {year.winter && (
                            <th>
                                winter
                                <ButtonGroup style={{ display: "flex" }}>
                                    <Button
                                        variant="success"
                                        onClick={() =>
                                            selectedSemester(year.winter!)
                                        }
                                        className="float-end"
                                    >
                                        AddQueue
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            updateYear({
                                                ...year,
                                                winter: {
                                                    ...year.winter,
                                                    courses: []
                                                } as SemesterI
                                            })
                                        }
                                        className="float-end"
                                    >
                                        Clear semester
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="float-end"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            updateYear(
                                                removeSemesterYear(
                                                    year,
                                                    year.winter!
                                                )
                                            );
                                        }}
                                    >
                                        remove
                                    </Button>
                                </ButtonGroup>
                            </th>
                        )}
                        {year.spring && (
                            <th>
                                Spring
                                <ButtonGroup style={{ display: "flex" }}>
                                    <Button
                                        variant="success"
                                        onClick={() =>
                                            selectedSemester(year.spring!)
                                        }
                                        className="float-end"
                                    >
                                        AddQueue
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            updateYear({
                                                ...year,
                                                spring: {
                                                    ...year.spring,
                                                    courses: []
                                                } as SemesterI
                                            })
                                        }
                                        className="float-end"
                                    >
                                        Clear semester
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="float-end"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            updateYear(
                                                removeSemesterYear(
                                                    year,
                                                    year.spring!
                                                )
                                            );
                                        }}
                                    >
                                        remove
                                    </Button>
                                </ButtonGroup>
                            </th>
                        )}
                        {year.summer && (
                            <th>
                                Summer
                                <ButtonGroup style={{ display: "flex" }}>
                                    <Button
                                        variant="success"
                                        onClick={() =>
                                            selectedSemester(year.summer!)
                                        }
                                        className="float-end"
                                    >
                                        AddQueue
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            updateYear({
                                                ...year,
                                                summer: {
                                                    ...year.summer,
                                                    courses: []
                                                } as SemesterI
                                            })
                                        }
                                        className="float-end"
                                    >
                                        Clear Semester
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="float-end"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            updateYear(
                                                removeSemesterYear(
                                                    year,
                                                    year.summer!
                                                )
                                            );
                                        }}
                                    >
                                        remove
                                    </Button>
                                </ButtonGroup>
                            </th>
                        )}
                    </tr>
                    <tr>
                        {["fall", "winter", "spring", "summer"].map(
                            (season: string) => {
                                return year[season as keyof yearI] ? (
                                    <td key={season}>
                                        <Semester
                                            rendSemester={
                                                year[
                                                    season as keyof yearI
                                                ] as SemesterI
                                            }
                                            edit={editCourse}
                                            clickToDeleteFromSemester={
                                                clickToDeleteFromSemester
                                            }
                                            coursePlan={coursePlan}
                                            updateCoursePlan={updateCoursePlan}
                                            backToQueue={backToQueue}
                                        />
                                    </td>
                                ) : null;
                            }
                        )}
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}
export function CourseplanClick({
    Courseplan,
    setCurrentCourseEdit,
    selectedSemester,
    UpdateCourseplan,
    backToQueue
}: {
    Courseplan: CoursePlan;
    setCurrentCourseEdit: (course: Course) => void;
    selectedSemester: (semester: SemesterI) => void;
    UpdateCourseplan: (courseplan: CoursePlan) => void;
    backToQueue: (sendcourse: Course) => void;
}) {
    const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
    const [currentYear, setCurrentYear] = useState<yearI | null>(null);

    const handleOpenAddSemesterModal = (year: yearI) => {
        setCurrentYear(year);
        setShowAddSemesterModal(true);
    };
    const handleDeleteCourse = (
        courseUUID: string,
        currentSemester: SemesterI
    ) => {
        const updatedCoursePlan = DeleteCourseFromSemester(
            currentSemester,
            courseUUID,
            Courseplan
        );
        UpdateCourseplan(updatedCoursePlan);
    };
    function backToQueueClick(sendcourse: Course, seemester: SemesterI) {
        backToQueue(sendcourse);
        handleDeleteCourse(sendcourse.UUID!, seemester);
    }
    const addSemesterToCoursePlan = (
        newSemester: SemesterI,
        yearName: string
    ) => {
        const updatedCoursePlan = {
            ...Courseplan,
            years: Courseplan.years.map((year) => {
                if (year.name === yearName) {
                    return {
                        ...year,
                        [newSemester.season]: newSemester
                    };
                }
                return year;
            })
        };
        UpdateCourseplan(updatedCoursePlan);
    };

    return (
        <div>
            <h2>In progress Course Plan</h2>
            <Button
                variant="danger"
                onClick={() => UpdateCourseplan(clearallsemester(Courseplan))}
                className="float-end"
            >
                Clear all Semester
            </Button>
            {Courseplan.years.map((curyear) => (
                <Year
                    year={curyear}
                    editCourse={setCurrentCourseEdit}
                    key={curyear.name}
                    coursePlan={Courseplan}
                    updateCoursePlan={UpdateCourseplan}
                    selectedSemester={selectedSemester}
                    updateYear={(updatedYear) =>
                        UpdateCourseplan(
                            UpdateCoureplanYear(
                                curyear,
                                updatedYear,
                                Courseplan
                            )
                        )
                    }
                    clickToDeleteFromSemester={handleDeleteCourse}
                    backToQueue={backToQueueClick}
                    addSemesterToYear={() =>
                        handleOpenAddSemesterModal(curyear)
                    }
                />
            ))}

            {showAddSemesterModal && currentYear && (
                <AddSemesterModal
                    show={showAddSemesterModal}
                    handleClose={() => setShowAddSemesterModal(false)}
                    year={currentYear}
                    addSemester={(newSemester) =>
                        addSemesterToCoursePlan(newSemester, currentYear.name)
                    }
                />
            )}
        </div>
    );
}
