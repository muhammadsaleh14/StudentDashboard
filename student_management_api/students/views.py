from rest_framework.decorators import action
from rest_framework import viewsets,status
from rest_framework.response import Response
from django.db.models import Avg
from .models import Student, Course, Enrollment, Attendance, Grade, Department
from .serializers import StudentSerializer, CourseSerializer,EnrollmentSerializer,AttendanceSerializer, GradeSerializer, DepartmentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @action(detail=False, methods=['get'], url_path='total-students')
    def total_students(self, request):
        total_students = self.queryset.count()  # Get total number of students
        return Response({"count": total_students})
    
    def retrieve(self, request, *args, **kwargs):
        student = self.get_object()  # Get the specific student
        serializer = self.get_serializer(student)
        return Response(serializer.data)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # Endpoint to get courses and their related average attendance
    @action(detail=False, methods=['get'], url_path='average-attendance')
    def average_attendance(self, request):
    # Annotate courses with the average attendance (percentage of presence)
        courses = Course.objects.annotate(
            average_attendance=Avg('attendance__status')
        ).values('id', 'name', 'average_attendance')

        # Convert the average attendance to a percentage, handle None case
        for course in courses:
            if course['average_attendance'] is not None:
                course['average_attendance'] *= 100  # Convert to percentage
            else:
                course['average_attendance'] = 0  # Set to 0 if no attendance records

        return Response(courses)

    @action(detail=False, methods=['get'], url_path='total-courses')
    def total_courses(self, request):
        total_courses = self.queryset.count()  # Get total number of courses
        return Response({"count": total_courses})
    
    # Endpoint to get courses and their related average grades
    @action(detail=False, methods=['get'], url_path='average-grade')
    def average_grade(self, request):
        # Annotate courses with the average grade
        courses = Course.objects.annotate(
            average_grade=Avg('grade__grade')
        ).values('id', 'name', 'average_grade')

        return Response(courses)
    
class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    
    @action(detail=False, methods=['delete'], url_path='delete-by-student-and-course')
    def delete_by_student_and_course(self, request):
        student_id = request.data.get('student')
        course_id = request.data.get('course')

        try:
            # Find the enrollment by student and course IDs
            enrollment = Enrollment.objects.get(student_id=student_id, course_id=course_id)
            enrollment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  # No content response after successful deletion
        except Enrollment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)  # Not found response if the enrollment does not exist

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer



class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

