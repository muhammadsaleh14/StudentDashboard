from rest_framework import serializers
from .models import Student, Course, Enrollment, Attendance, Grade, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['grade']

class CourseSerializer(serializers.ModelSerializer):
    attendance_percentage = serializers.SerializerMethodField()
    grades = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'attendance_percentage', 'grades']

    def get_attendance_percentage(self, obj):
        # Get total attendance records for the student in this course
        total_classes = Attendance.objects.filter(course=obj).count()
        if total_classes == 0:
            return 0  # Avoid division by zero
        
        # Count how many times the student was present
        attended_classes = Attendance.objects.filter(course=obj, status=True).count()
        
        # Calculate the percentage
        attendance_percentage = (attended_classes / total_classes) * 100
        return round(attendance_percentage, 2)

    def get_grades(self, obj):
        # Get grades for the specific course
        grades_records = Grade.objects.filter(course=obj)
        return GradeSerializer(grades_records, many=True).data

class StudentSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()  # Include department details
    courses = serializers.SerializerMethodField()  # We'll add this method

    class Meta:
        model = Student
        fields = ['id', 'name', 'cnic', 'department', 'date_of_birth', 'image', 'courses']

    def get_courses(self, obj):
        enrollments = Enrollment.objects.filter(student=obj)
        courses = [enrollment.course for enrollment in enrollments]
        return CourseSerializer(courses, many=True).data

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'