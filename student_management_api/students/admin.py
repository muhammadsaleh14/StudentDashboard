from django.contrib import admin
from django.db.models import Max
from .models import Student, Course, Enrollment, Attendance, Grade, Department

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_students']  # Add custom method to list_display

    # Custom method to fetch and display related students
    def get_students(self, obj):
        # Fetch all students related to this department
        students = obj.student_set.all()
        # Join student names separated by commas
        return ", ".join([student.name for student in students])

    # Set the column name in the admin panel
    get_students.short_description = 'Students'

class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'get_courses']

    # Override queryset to group by student and get the latest enrollment records
    def get_queryset(self, request):
        max_ids_subquery = Enrollment.objects.values('student').annotate(max_id=Max('id')).values('max_id')

        queryset = Enrollment.objects.filter(id__in=max_ids_subquery)
        return queryset

    # Display the student's courses as a comma-separated list
    def get_courses(self, obj):
        courses = Course.objects.filter(enrollment__student=obj.student)
        return ", ".join([course.name for course in courses])

    get_courses.short_description = 'Courses'

admin.site.register(Student)
admin.site.register(Department,DepartmentAdmin)
admin.site.register(Course)
admin.site.register(Enrollment,EnrollmentAdmin)
admin.site.register(Attendance)
admin.site.register(Grade)
